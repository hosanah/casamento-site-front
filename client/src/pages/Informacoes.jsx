import React, { useState, useEffect, useCallback, useRef } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import API_URL from '../config/api';

const PageContainer = styled.div`
  width: 100vw;
  max-width: 100%;
`;

const PageContent = styled.div`
  width: 100%;
  margin: 0 auto;
  padding: 60px var(--container-padding);
  
  @media (max-width: 768px) {
    padding: 40px var(--container-padding);
  }
`;

const SectionTitle = styled.h2`
  text-align: center;
  margin-bottom: 50px;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -15px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 1px;
    background-color: var(--primary);
  }
`;

const GroupTitle = styled.h3`
  text-align: center;
  margin: 60px 0 30px;
  font-family: var(--font-serif);
  color: var(--accent);
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 50px;
    height: 1px;
    background-color: var(--accent);
  }
  
  &:first-of-type {
    margin-top: 0;
  }
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 40px;
  width: 100%;
  margin-bottom: 60px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 30px;
  }
`;

const InfoCard = styled.div`
  text-align: center;
  padding: 40px 30px;
  background-color: var(--white);
  border-radius: 5px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const InfoIcon = styled.div`
  font-size: 2.5rem;
  color: var(--primary);
  margin-bottom: 20px;
`;

const InfoTitle = styled.h3`
  font-family: var(--font-serif);
  font-size: 1.5rem;
  margin-bottom: 15px;
`;

const InfoText = styled.div`
  white-space: pre-line;
  text-align: left;
`;

const MapContainer = styled.div`
  height: 400px;
  margin-top: 30px;
  border-radius: 5px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  width: 100%;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  
  iframe {
    width: 100%;
    height: 100%;
    border: 0;
  }
`;

const PhotoContainer = styled.div`
  height: 300px;
  margin-top: 30px;
  border-radius: 5px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  width: 100%;
  background-color: #f0f0f0;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
  width: 100%;
  font-size: 1.2rem;
  color: var(--accent);
`;

const ErrorContainer = styled.div`
  background-color: #f8d7da;
  color: #721c24;
  padding: 20px;
  border-radius: 5px;
  text-align: center;
  margin: 20px auto;
  max-width: 800px;
`;

// Cache de imagens para evitar múltiplas requisições
const imageCache = {};

// Componente de imagem otimizado para evitar múltiplas requisições
const OptimizedImage = ({ src, alt, fallbackSrc }) => {
  const [imgSrc, setImgSrc] = useState(null);
  const imgRef = useRef(null);
  const hasErrored = useRef(false);
  
  useEffect(() => {
    // Verificar se a imagem já está no cache
    if (imageCache[src]) {
      setImgSrc(imageCache[src]);
      return;
    }
    
    // Verificar se a imagem existe antes de tentar carregá-la
    const img = new Image();
    img.onload = () => {
      imageCache[src] = src; // Adicionar ao cache
      setImgSrc(src);
    };
    img.onerror = () => {
      if (!hasErrored.current) {
        hasErrored.current = true;
        imageCache[src] = fallbackSrc; // Adicionar fallback ao cache
        setImgSrc(fallbackSrc);
      }
    };
    img.src = src;
    
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src, fallbackSrc]);
  
  if (!imgSrc) {
    return <div style={{ width: '100%', height: '100%', backgroundColor: '#f0f0f0' }} />;
  }
  
  return <img ref={imgRef} src={imgSrc} alt={alt} />;
};

// Função para gerar URL do Google Maps a partir de um endereço
const getGoogleMapsEmbedUrl = (address) => {
  if (!address) return '';
  const encodedAddress = encodeURIComponent(address);
  return `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodedAddress}`;
};

const Informacoes = () => {
  const [infoSections, setInfoSections] = useState({
    group1: [], // Cerimônia e Recepção
    group2: []  // Dress Code, Hospedagem e Transporte
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const fetchInformacoes = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/content/informacoes`);
      
      if (response.data && response.data.content) {
        try {
          // Tentar fazer parse do JSON
          const parsedContent = JSON.parse(response.data.content);
          
          // Criar as seções com os dados do backend, separadas em dois grupos
          const group1 = [
            {
              icon: '🏛️',
              title: 'Cerimônia',
              text: parsedContent.cerimonia || 'Informações em breve',
              map: true,
              address: parsedContent.cerimonia_address || '',
              photo: parsedContent.cerimonia_photo || '',
              showPhoto: !!parsedContent.cerimonia_photo
            },
            {
              icon: '🥂',
              title: 'Recepção',
              text: parsedContent.recepcao || 'Informações em breve',
              map: !!parsedContent.recepcao_address,
              address: parsedContent.recepcao_address || '',
              photo: parsedContent.recepcao_photo || '',
              showPhoto: !!parsedContent.recepcao_photo
            }
          ];
          
          const group2 = [
            {
              icon: '👔',
              title: 'Dress Code',
              text: parsedContent.dressCode || 'Informações em breve',
              photo: parsedContent.dressCode_photo || '',
              showPhoto: !!parsedContent.dressCode_photo
            },
            {
              icon: '🏨',
              title: 'Hospedagem Sugerida',
              text: parsedContent.hospedagem || 'Informações em breve',
              map: !!parsedContent.hospedagem_address,
              address: parsedContent.hospedagem_address || '',
              photo: parsedContent.hospedagem_photo || '',
              showPhoto: !!parsedContent.hospedagem_photo
            },
            {
              icon: '🚗',
              title: 'Transporte',
              text: parsedContent.transporte || 'Informações em breve',
              map: !!parsedContent.transporte_address,
              address: parsedContent.transporte_address || '',
              photo: parsedContent.transporte_photo || '',
              showPhoto: !!parsedContent.transporte_photo
            }
          ];
          
          setInfoSections({ group1, group2 });
        } catch (e) {
          // Se não for JSON, usar o formato antigo
          console.error('Erro ao fazer parse do conteúdo:', e);
          setError('Erro ao carregar informações. Por favor, tente novamente mais tarde.');
        }
      } else {
        setInfoSections({ group1: [], group2: [] });
      }
      
      setError('');
    } catch (error) {
      console.error('Erro ao buscar informações:', error);
      setError('Erro ao carregar informações. Por favor, tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  }, []);
  
  useEffect(() => {
    fetchInformacoes();
  }, [fetchInformacoes]);
  
  if (loading) {
    return (
      <PageContainer className="informacoes-page">
        <PageContent>
          <SectionTitle>Informações</SectionTitle>
          <LoadingContainer>Carregando informações...</LoadingContainer>
        </PageContent>
      </PageContainer>
    );
  }
  
  if (error) {
    return (
      <PageContainer className="informacoes-page">
        <PageContent>
          <SectionTitle>Informações</SectionTitle>
          <ErrorContainer>{error}</ErrorContainer>
        </PageContent>
      </PageContainer>
    );
  }
  
  // Renderizar um card de informação
  const renderInfoCard = (section) => (
    <InfoCard>
      <InfoIcon>{section.icon}</InfoIcon>
      <InfoTitle>{section.title}</InfoTitle>
      <InfoText>{section.text}</InfoText>
      
      {section.showPhoto && (
        <PhotoContainer>
          <OptimizedImage 
            src={`/images/${section.photo}`} 
            alt={section.title} 
            fallbackSrc="/images/placeholder.jpg"
          />
        </PhotoContainer>
      )}
      
      {section.map && section.address && (
        <MapContainer>
          <iframe
            title={`Mapa - ${section.title}`}
            src={getGoogleMapsEmbedUrl(section.address)}
            allowFullScreen
            loading="lazy"
          ></iframe>
        </MapContainer>
      )}
    </InfoCard>
  );
  
  return (
    <PageContainer className="informacoes-page">
      <PageContent>
        <SectionTitle>Informações</SectionTitle>
        
        {/* Primeiro grupo: Cerimônia e Recepção */}
        <GroupTitle>Cerimônia e Recepção</GroupTitle>
        <InfoGrid>
          {infoSections.group1.map((section, index) => (
            <React.Fragment key={index}>
              {renderInfoCard(section)}
            </React.Fragment>
          ))}
        </InfoGrid>
        
        {/* Segundo grupo: Dress Code, Hospedagem e Transporte */}
        <GroupTitle>Informações Adicionais</GroupTitle>
        <InfoGrid>
          {infoSections.group2.map((section, index) => (
            <React.Fragment key={index}>
              {renderInfoCard(section)}
            </React.Fragment>
          ))}
        </InfoGrid>
      </PageContent>
    </PageContainer>
  );
};

export default Informacoes;
