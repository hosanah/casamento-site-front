import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const PageContainer = styled.div`
  width: 100%;
`;

const PageContent = styled.div`
  width: 100%;
  margin: 0 auto;
  padding: 60px 20px;
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

const AlbumTabs = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 40px;
  border-bottom: 1px solid rgba(182, 149, 192, 0.3);
  width: 100%;
  flex-wrap: wrap;
`;

const AlbumTab = styled.div`
  padding: 15px 30px;
  margin: 0 5px;
  cursor: pointer;
  border-bottom: 2px solid ${props => props.active ? 'var(--primary)' : 'transparent'};
  font-family: var(--font-serif);
  font-size: 1.2rem;
  transition: all 0.3s ease;
  color: ${props => props.active ? 'var(--primary)' : 'var(--accent)'};
  
  &:hover {
    color: var(--primary);
  }
`;

const AlbumCarousel = styled.div`
  margin-bottom: 40px;
  position: relative;
  border-radius: 5px;
  overflow: hidden;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  width: 100%;
`;

const CarouselImage = styled.img`
  width: 100%;
  height: 600px;
  object-fit: cover;
  
  @media (max-width: 992px) {
    height: 500px;
  }
  
  @media (max-width: 768px) {
    height: 400px;
  }
  
  @media (max-width: 576px) {
    height: 300px;
  }
`;

const CarouselImageFallback = styled.div`
  width: 100%;
  height: 600px;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 1.2rem;
  
  @media (max-width: 992px) {
    height: 500px;
  }
  
  @media (max-width: 768px) {
    height: 400px;
  }
  
  @media (max-width: 576px) {
    height: 300px;
  }
`;

const CarouselNav = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 50px;
  height: 50px;
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1.5rem;
  color: var(--accent);
  transition: all 0.3s ease;
  z-index: 2;
  
  &:hover {
    background-color: var(--white);
  }
`;

const CarouselPrev = styled(CarouselNav)`
  left: 20px;
`;

const CarouselNext = styled(CarouselNav)`
  right: 20px;
`;

const AlbumGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  width: 100%;
  
  @media (max-width: 576px) {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
`;

const AlbumThumbnail = styled.div`
  height: 250px;
  border-radius: 5px;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  
  @media (max-width: 576px) {
    height: 150px;
  }
`;

const ThumbnailImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
  }
`;

const ThumbnailFallback = styled.div`
  width: 100%;
  height: 100%;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 0.8rem;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
  width: 100%;
`;

const ErrorContainer = styled.div`
  text-align: center;
  padding: 2rem;
  color: var(--error-text);
  background-color: var(--error);
  border-radius: 5px;
  margin: 2rem auto;
  max-width: 600px;
`;

const EmptyAlbumMessage = styled.div`
  text-align: center;
  padding: 3rem;
  background-color: var(--white);
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  grid-column: 1 / -1;
  
  h3 {
    color: var(--accent);
    margin-bottom: 1rem;
  }
  
  p {
    color: var(--text);
  }
`;

// Componente seguro para exibir imagens com fallback
const SafeImage = ({ src, alt, className, onClick }) => {
  const [hasError, setHasError] = useState(false);
  const imageRef = useRef(null);
  
  // Verificar se a URL da imagem é válida
  useEffect(() => {
    setHasError(false);
  }, [src]);
  
  if (hasError || !src) {
    return <ThumbnailFallback className={className} onClick={onClick}>Imagem não disponível</ThumbnailFallback>;
  }
  
  return (
    <img
      ref={imageRef}
      src={src}
      alt={alt}
      className={className}
      onClick={onClick}
      onError={() => setHasError(true)}
      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
    />
  );
};

// Mapeamento de chaves de galeria
const galleryKeys = {
  'pre-wedding': 'preWedding',
  'momentos': 'momentos',
  'padrinhos': 'padrinhos',
  'festa': 'festa'
};

// Mapeamento de nomes de galeria
const galleryNames = {
  'pre-wedding': 'Pré-Wedding',
  'momentos': 'Momentos Especiais',
  'padrinhos': 'Padrinhos',
  'festa': 'Festa'
};

const Album = () => {
  const [activeTab, setActiveTab] = useState('pre-wedding');
  const [activeImage, setActiveImage] = useState(0);
  const [albums, setAlbums] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Buscar fotos do álbum
  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        setIsLoading(true);
        
        // Buscar apenas fotos ativas
        const response = await axios.get('http://localhost:3001/api/album?active=true');
        
        if (response.data) {
          setAlbums(response.data);
          setError('');
        }
      } catch (err) {
        console.error('Erro ao buscar fotos do álbum:', err);
        setError('Não foi possível carregar as fotos. Por favor, tente novamente mais tarde.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAlbums();
  }, []);
  
  // Fallback para dados mockados caso não haja fotos no banco
  useEffect(() => {
    if (!isLoading && Object.keys(albums).length === 0 && !error) {
      setAlbums({
        'preWedding': [
          { id: 1, image: '/images/couple-background.png', title: 'Foto 1' },
          { id: 2, image: '/images/couple-background.png', title: 'Foto 2' },
          { id: 3, image: '/images/couple-background.png', title: 'Foto 3' },
          { id: 4, image: '/images/couple-background.png', title: 'Foto 4' },
          { id: 5, image: '/images/couple-background.png', title: 'Foto 5' },
          { id: 6, image: '/images/couple-background.png', title: 'Foto 6' }
        ],
        'momentos': [
          { id: 7, image: '/images/couple-background.png', title: 'Foto 7' },
          { id: 8, image: '/images/couple-background.png', title: 'Foto 8' },
          { id: 9, image: '/images/couple-background.png', title: 'Foto 9' },
          { id: 10, image: '/images/couple-background.png', title: 'Foto 10' }
        ],
        'padrinhos': [
          { id: 11, image: '/images/couple-background.png', title: 'Foto 11' },
          { id: 12, image: '/images/couple-background.png', title: 'Foto 12' },
          { id: 13, image: '/images/couple-background.png', title: 'Foto 13' }
        ],
        'festa': [
          { id: 14, image: '/images/couple-background.png', title: 'Foto 14' },
          { id: 15, image: '/images/couple-background.png', title: 'Foto 15' },
          { id: 16, image: '/images/couple-background.png', title: 'Foto 16' },
          { id: 17, image: '/images/couple-background.png', title: 'Foto 17' },
          { id: 18, image: '/images/couple-background.png', title: 'Foto 18' }
        ]
      });
    }
  }, [isLoading, albums, error]);
  
  const handlePrev = () => {
    const currentGallery = albums[galleryKeys[activeTab]] || [];
    if (currentGallery.length === 0) return;
    
    setActiveImage(prev => (prev === 0 ? currentGallery.length - 1 : prev - 1));
  };
  
  const handleNext = () => {
    const currentGallery = albums[galleryKeys[activeTab]] || [];
    if (currentGallery.length === 0) return;
    
    setActiveImage(prev => (prev === currentGallery.length - 1 ? 0 : prev + 1));
  };
  
  const handleThumbnailClick = (index) => {
    setActiveImage(index);
  };
  
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setActiveImage(0);
  };
  
  // Obter fotos da galeria atual
  const currentGallery = albums[galleryKeys[activeTab]] || [];
  
  // Verificar se há fotos na galeria atual
  const hasPhotos = currentGallery.length > 0;
  
  // Obter a foto atual
  const currentPhoto = hasPhotos ? currentGallery[activeImage] : null;
  
  // Função para formatar URL da imagem
  const formatImageUrl = (imagePath) => {
    if (!imagePath) return null;
    
    if (imagePath.startsWith('/')) {
      return `http://localhost:3001${imagePath}`;
    }
    
    return imagePath;
  };
  
  return (
    <PageContainer className="album-page">
      <PageContent>
        <SectionTitle>Álbum</SectionTitle>
        
        {isLoading ? (
          <LoadingContainer>
            <p>Carregando fotos...</p>
          </LoadingContainer>
        ) : error ? (
          <ErrorContainer>
            <p>{error}</p>
          </ErrorContainer>
        ) : (
          <>
            <AlbumTabs>
              {Object.keys(galleryNames).map(key => (
                <AlbumTab 
                  key={key}
                  active={activeTab === key} 
                  onClick={() => handleTabChange(key)}
                >
                  {galleryNames[key]}
                </AlbumTab>
              ))}
            </AlbumTabs>
            
            {hasPhotos ? (
              <>
                <AlbumCarousel>
                  {currentPhoto && (
                    currentPhoto.image ? (
                      <SafeImage 
                        src={formatImageUrl(currentPhoto.image)}
                        alt={currentPhoto.title || `Foto ${activeImage + 1} do álbum ${galleryNames[activeTab]}`}
                        className="carousel-image"
                      />
                    ) : (
                      <CarouselImageFallback>
                        Imagem não disponível
                      </CarouselImageFallback>
                    )
                  )}
                  <CarouselPrev onClick={handlePrev}>❮</CarouselPrev>
                  <CarouselNext onClick={handleNext}>❯</CarouselNext>
                </AlbumCarousel>
                
                <AlbumGrid>
                  {currentGallery.map((photo, index) => (
                    <AlbumThumbnail 
                      key={photo.id || index} 
                      onClick={() => handleThumbnailClick(index)}
                      style={{ border: activeImage === index ? '3px solid var(--primary)' : 'none' }}
                    >
                      <SafeImage 
                        src={formatImageUrl(photo.image)}
                        alt={photo.title || `Miniatura ${index + 1} do álbum ${galleryNames[activeTab]}`}
                        onClick={() => handleThumbnailClick(index)}
                      />
                    </AlbumThumbnail>
                  ))}
                </AlbumGrid>
              </>
            ) : (
              <EmptyAlbumMessage>
                <h3>Nenhuma foto disponível</h3>
                <p>Não há fotos cadastradas para a galeria {galleryNames[activeTab]}.</p>
              </EmptyAlbumMessage>
            )}
          </>
        )}
      </PageContent>
    </PageContainer>
  );
};

export default Album;
