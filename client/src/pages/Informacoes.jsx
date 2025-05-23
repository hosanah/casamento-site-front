import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import axios from 'axios';

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

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 40px;
  width: 100%;
  
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

const Informacoes = () => {
  const [infoSections, setInfoSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const fetchInformacoes = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3001/api/content/informacoes');
      
      if (response.data && response.data.content) {
        try {
          // Tentar fazer parse do JSON
          const parsedContent = JSON.parse(response.data.content);
          
          // Criar as seções com os dados do backend
          setInfoSections([
            {
              icon: '🏛️',
              title: 'Cerimônia',
              text: parsedContent.cerimonia || 'Informações em breve',
            },
            {
              icon: '🥂',
              title: 'Recepção',
              text: parsedContent.recepcao || 'Informações em breve',
            },
            {
              icon: '👔',
              title: 'Dress Code',
              text: parsedContent.dressCode || 'Informações em breve',
            },
            {
              icon: '🏨',
              title: 'Hospedagem Sugerida',
              text: parsedContent.hospedagem || 'Informações em breve',
            },
            {
              icon: '🚗',
              title: 'Transporte',
              text: parsedContent.transporte || 'Informações em breve',
            }
          ]);
        } catch (e) {
          // Se não for JSON, usar o formato antigo
          console.error('Erro ao fazer parse do conteúdo:', e);
          setError('Erro ao carregar informações. Por favor, tente novamente mais tarde.');
        }
      } else {
        setInfoSections([]);
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
  
  return (
    <PageContainer className="informacoes-page">
      <PageContent>
        <SectionTitle>Informações</SectionTitle>
        
        <InfoGrid>
          {infoSections.map((section, index) => (
            <InfoCard key={index}>
              <InfoIcon>{section.icon}</InfoIcon>
              <InfoTitle>{section.title}</InfoTitle>
              <InfoText>{section.text}</InfoText>
              
              {section.map && (
                <MapContainer>
                  Mapa será exibido aqui
                </MapContainer>
              )}
            </InfoCard>
          ))}
        </InfoGrid>
      </PageContent>
    </PageContainer>
  );
};

export default Informacoes;
