import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import API_URL from '../config/api';

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

// Componente para dividir a tela em duas colunas
const SplitContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 40px;
  width: 100%;
  
  @media (max-width: 768px) {
    flex-direction: column; // Empilha em dispositivos móveis
  }
`;

// Coluna da esquerda para a foto
const LeftColumn = styled.div`
  flex: 1;
  padding-right: 20px;
  
  @media (max-width: 768px) {
    padding-right: 0;
    margin-bottom: 20px;
  }
`;

// Coluna da direita para o texto
const RightColumn = styled.div`
  flex: 1;
  padding-left: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  
  @media (max-width: 768px) {
    padding-left: 0;
  }
`;

// Texto descritivo para a coluna da direita
const PhotoDescription = styled.div`
  color: var(--text);
  
  h3 {
    color: var(--accent);
    margin-bottom: 15px;
    font-family: var(--font-serif);
    font-size: 1.5rem;
  }
  
  p {
    margin-bottom: 15px;
    line-height: 1.6;
    white-space: pre-wrap;
  }
`;

// Container do carrossel para ocupar apenas a coluna esquerda
const AlbumCarousel = styled.div`
  position: relative;
  border-radius: 5px;
  overflow: hidden;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

// Imagem do carrossel para ocupar 100% da coluna esquerda
const CarouselImage = styled.img`
  width: 100%; 
  max-height: 400px;
  object-fit: contain;
  
  @media (max-width: 992px) {
    max-height: 350px;
  }
  
  @media (max-width: 768px) {
    max-height: 300px;
  }
  
  @media (max-width: 576px) {
    max-height: 250px;
  }
`;

// Fallback para manter consistência com a imagem
const CarouselImageFallback = styled.div`
  width: 100%;
  height: 400px;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 1.2rem;
  
  @media (max-width: 992px) {
    height: 350px;
  }
  
  @media (max-width: 768px) {
    height: 300px;
  }
  
  @media (max-width: 576px) {
    height: 250px;
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

const TextCounter = styled.div`
  text-align: center;
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: var(--text);
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

// Textos descritivos para cada galeria (agora como arrays)
const galleryDescriptions = {
  'preWedding': [
    {
      title: 'Ensaio Pré-Wedding',
      description: 'Momentos especiais capturados antes do grande dia. Estas fotos representam a jornada de amor e companheirismo que nos trouxe até aqui.'
    },
    {
      title: 'Nossa História',
      description: 'Cada foto deste ensaio conta um pouco da nossa história. Momentos de carinho, cumplicidade e amor que construímos ao longo do tempo.'
    },
    {
      title: 'Expectativa para o Grande Dia',
      description: 'O ensaio pré-wedding foi uma oportunidade de registrar a expectativa e a emoção que sentimos na preparação para o nosso casamento.'
    },
    {
      title: 'Cenários Especiais',
      description: 'Escolhemos locais que têm significado especial em nossa história para realizar este ensaio, trazendo ainda mais emoção para estas fotografias.'
    }
  ],
  'momentos': [
    {
      title: 'Momentos Especiais',
      description: 'Pequenos instantes que se tornaram grandes memórias. Esta galeria reúne momentos significativos de nossa história juntos.'
    },
    {
      title: 'Primeiros Passos',
      description: 'Os primeiros momentos de nossa jornada juntos, desde o início do relacionamento até os preparativos para o casamento.'
    },
    {
      title: 'Encontros Memoráveis',
      description: 'Viagens, encontros com amigos e familiares, celebrações... Cada momento especial que compartilhamos está registrado nestas imagens.'
    },
    {
      title: 'Construindo Memórias',
      description: 'A construção de nossa história é feita de pequenos momentos que, juntos, formam a base de nosso relacionamento e de nosso futuro.'
    }
  ],
  'padrinhos': [
    {
      title: 'Nossos Padrinhos',
      description: 'Pessoas especiais que escolhemos para nos acompanhar neste momento tão importante. Nossos padrinhos representam o apoio e o carinho que recebemos.'
    },
    {
      title: 'Amizades Valiosas',
      description: 'Nossos padrinhos são amigos e familiares que têm um lugar especial em nossas vidas e que escolhemos para estarem ao nosso lado neste momento único.'
    },
    {
      title: 'Testemunhas de Nossa União',
      description: 'Mais do que convidados especiais, nossos padrinhos são testemunhas de nossa união e do compromisso que assumimos um com o outro.'
    },
    {
      title: 'Gratidão e Carinho',
      description: 'Expressamos nossa gratidão a cada um de nossos padrinhos pelo apoio, carinho e por aceitarem fazer parte deste momento tão especial em nossas vidas.'
    }
  ],
  'festa': [
    {
      title: 'A Grande Celebração',
      description: 'A alegria e emoção do nosso dia especial. Estas fotos capturam a essência da nossa celebração de amor.'
    },
    {
      title: 'Momentos da Cerimônia',
      description: 'A cerimônia foi repleta de emoção, com votos sinceros e a presença de pessoas queridas que compartilharam conosco este momento único.'
    },
    {
      title: 'Recepção e Comemoração',
      description: 'A festa foi uma celebração de amor, com música, dança e muita alegria. Cada detalhe foi pensado para tornar este dia inesquecível.'
    },
    {
      title: 'Detalhes e Decoração',
      description: 'Cada elemento da decoração foi escolhido com carinho para criar um ambiente acolhedor e que refletisse nossa personalidade e história.'
    }
  ]
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
        const response = await axios.get(`${API_URL}/api/album?active=true`);
        
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
  
  // Obter os textos da galeria atual
  const getCurrentGalleryTexts = () => {
    return galleryDescriptions[galleryKeys[activeTab]] || [];
  };
  
  // Obter o texto atual com base no índice da foto ativa
  // Isso garante que o texto mude automaticamente com a foto
  const getCurrentText = () => {
    const texts = getCurrentGalleryTexts();
    
    if (texts.length === 0) {
      return {
        title: galleryNames[activeTab] || 'Álbum de Fotos',
        description: 'Uma coleção de memórias especiais do nosso relacionamento e casamento.'
      };
    }
    
    // Usar o índice da foto para determinar qual texto exibir
    // Se houver mais fotos que textos, repetir os textos em ciclo
    const textIndex = activeImage % texts.length;
    return texts[textIndex];
  };
  
  // Função para formatar URL da imagem
  const formatImageUrl = (imagePath) => {
    if (!imagePath) return null;
    
    if (imagePath.startsWith('/')) {
      return `${API_URL}${imagePath}`;
    }
    
    return imagePath;
  };
  
  // Obter o texto atual
  const currentText = getCurrentText();
  // Obter o número total de textos
  const totalTexts = getCurrentGalleryTexts().length;
  // Calcular o índice do texto atual (baseado no índice da foto)
  const currentTextIndex = totalTexts > 0 ? activeImage % totalTexts : 0;
  
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
                {/* Layout dividido: foto à esquerda, texto à direita */}
                <SplitContainer>
                  <LeftColumn>
                    <AlbumCarousel>
                      {currentPhoto && (
                        currentPhoto.image ? (
                          <CarouselImage 
                            src={formatImageUrl(currentPhoto.image)}
                            alt={currentPhoto.title || `Foto ${activeImage + 1} do álbum ${galleryNames[activeTab]}`}
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
                  </LeftColumn>
                  
                  <RightColumn>
                    <PhotoDescription>
                      <h3>{currentText.title}</h3>
                      <p>{currentText.description}</p>
                      {currentPhoto && currentPhoto.title && (
                        <p><strong>Título da foto:</strong> {currentPhoto.title}</p>
                      )}
                      <p><strong>Foto {activeImage + 1} de {currentGallery.length}</strong></p>
                      
                      {/* Mostrar o contador de textos se houver mais de um texto */}
                      {totalTexts > 1 && (
                        <TextCounter>
                          Texto {currentTextIndex + 1} de {totalTexts}
                        </TextCounter>
                      )}
                    </PhotoDescription>
                  </RightColumn>
                </SplitContainer>
                
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
