import React from 'react';
import styled from 'styled-components';
import axios from 'axios';
import API_URL from '../config/api';

const PageContainer = styled.div`
  width: 100%;
`;

const PageContent = styled.div`
  width: 100%;
  max-width: var(--container-width);
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

const SubSectionTitle = styled.h3`
  text-align: center;
  margin-bottom: 30px;
  font-family: var(--font-serif);
  color: var(--primary);
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 1px;
    background-color: var(--primary);
  }
`;

const WelcomeSection = styled.div`
  margin-bottom: 60px;
  background-color: var(--white);
  padding: 30px;
  border-radius: 5px;
  box-shadow: var(--shadow-md);
`;

const WelcomeText = styled.div`
  white-space: pre-line;
  line-height: 1.8;
  text-align: justify;
  
  p {
    margin-bottom: 15px;
  }
`;

const Timeline = styled.div`
  position: relative;
  width: 100%;
  margin: 0 auto;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 1px;
    height: 100%;
    background-color: var(--primary);
  }
  
  @media (max-width: 768px) {
    &::before {
      left: 30px;
    }
  }
`;

const TimelineItem = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-right: 40px;
  position: relative;
  margin-bottom: 60px;
  
  &:nth-child(even) {
    justify-content: flex-start;
    padding-right: 0;
    padding-left: 40px;
  }
  
  @media (max-width: 768px) {
    justify-content: flex-start;
    padding-right: 0;
    padding-left: 70px;
    
    &:nth-child(even) {
      padding-left: 70px;
    }
  }
`;

const TimelineContent = styled.div`
  width: 45%;
  padding: 30px;
  background-color: var(--white);
  border-radius: 5px;
  box-shadow: var(--shadow-md);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    width: 20px;
    height: 20px;
    background-color: var(--white);
    top: 20px;
    transform: rotate(45deg);
  }
  
  ${TimelineItem}:nth-child(odd) &::before {
    right: -10px;
  }
  
  ${TimelineItem}:nth-child(even) &::before {
    left: -10px;
  }
  
  @media (max-width: 768px) {
    width: 100%;
    
    &::before {
      left: -10px;
    }
  }
`;

const TimelineDate = styled.div`
  font-family: var(--font-serif);
  color: var(--primary);
  font-size: 1.2rem;
  margin-bottom: 10px;
`;

const TimelineDot = styled.div`
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background-color: var(--primary);
  border: 3px solid var(--white);
  z-index: 1;
  
  @media (max-width: 768px) {
    left: 30px;
  }
`;

const TimelineImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 5px;
  margin-bottom: 15px;
`;

const TimelineImageFallback = styled.div`
  width: 100%;
  height: 200px;
  background-color: #f0f0f0;
  border-radius: 5px;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 0.9rem;
`;

const TimelineTitle = styled.h3`
  font-family: var(--font-serif);
  margin-bottom: 10px;
`;

const TimelineText = styled.p`
  margin-bottom: 0;
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

const TimelineImageWithFallback = ({ src, alt }) => {
  const [hasError, setHasError] = React.useState(!src);
  
  if (!src || hasError) {
    return (
      <TimelineImageFallback>
        Imagem não disponível
      </TimelineImageFallback>
    );
  }
  
  return (
    <TimelineImage 
      src={`${API_URL}${src}`}
      alt={alt}
      onError={() => setHasError(true)}
    />
  );
};

const NossaHistoria = () => {
  const [timelineEvents, setTimelineEvents] = React.useState([]);
  const [welcomeText, setWelcomeText] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(true);
  const [isLoadingWelcome, setIsLoadingWelcome] = React.useState(true);
  const [error, setError] = React.useState('');
  const [welcomeError, setWelcomeError] = React.useState('');
  
  // Buscar o texto de boas-vindas da rota de conteúdo
  React.useEffect(() => {
    const fetchWelcomeText = async () => {
      try {
        setIsLoadingWelcome(true);
        
        const response = await axios.get(`${API_URL}/api/content/historia`);
        
        if (response.data && response.data.content) {
          setWelcomeText(response.data.content);
        } else {
          setWelcomeText('');
        }
        
        setWelcomeError('');
      } catch (error) {
        console.error('Erro ao buscar texto de boas-vindas:', error);
        setWelcomeError('Não foi possível carregar o texto de boas-vindas.');
        setWelcomeText('');
      } finally {
        setIsLoadingWelcome(false);
      }
    };
    
    fetchWelcomeText();
  }, []);
  
  // Buscar os eventos da timeline
  React.useEffect(() => {
    const fetchStoryEvents = async () => {
      try {
        setIsLoading(true);
        
        const response = await axios.get(`${API_URL}/api/story-events`);
        
        // Ordenar eventos por ordem e depois por data
        const sortedEvents = response.data.sort((a, b) => {
          if (a.order !== b.order) {
            return a.order - b.order;
          }
          return new Date(a.createdAt) - new Date(b.createdAt);
        });
        
        setTimelineEvents(sortedEvents);
        setError('');
      } catch (error) {
        console.error('Erro ao buscar eventos da história:', error);
        setError('Não foi possível carregar nossa história. Por favor, tente novamente mais tarde.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStoryEvents();
  }, []);
  
  // Fallback para dados mockados caso não haja eventos no banco
  React.useEffect(() => {
    if (!isLoading && timelineEvents.length === 0 && !error) {
      setTimelineEvents([
        {
          id: 1,
          date: 'Janeiro de 2020',
          title: 'Primeiro Encontro',
          text: 'Nos conhecemos em uma festa de amigos em comum. Foi uma conexão instantânea.',
          image: '/images/couple-background.png'
        },
        {
          id: 2,
          date: 'Março de 2020',
          title: 'Primeiro Beijo',
          text: 'Depois de algumas semanas conversando, tivemos nosso primeiro beijo em um piquenique no parque.',
          image: '/images/couple-background.png'
        },
        {
          id: 3,
          date: 'Junho de 2020',
          title: 'Pedido de Namoro',
          text: 'Em um jantar romântico à luz de velas, oficializamos nosso relacionamento.',
          image: '/images/couple-background.png'
        },
        {
          id: 4,
          date: 'Dezembro de 2021',
          title: 'Primeira Viagem Juntos',
          text: 'Passamos o Ano Novo em uma praia paradisíaca, onde fortalecemos ainda mais nossa relação.',
          image: '/images/couple-background.png'
        },
        {
          id: 5,
          date: 'Setembro de 2023',
          title: 'Pedido de Casamento',
          text: 'Durante um pôr do sol incrível, ele se ajoelhou e fez o pedido. Obviamente, a resposta foi sim!',
          image: '/images/couple-background.png'
        }
      ]);
    }
  }, [isLoading, timelineEvents.length, error]);
  
  // Formatar o texto de boas-vindas para exibição
  const formatWelcomeText = (text) => {
    if (!text) return '';
    
    // Dividir o texto em parágrafos
    return text.split('\n\n').map((paragraph, index) => (
      <p key={index}>{paragraph}</p>
    ));
  };
  
  return (
    <PageContainer>
      <PageContent>
        <SectionTitle>Nossa História</SectionTitle>
        
        {/* Seção de Boas-Vindas */}
        {isLoadingWelcome ? (
          <LoadingContainer>
            <p>Carregando texto de boas-vindas...</p>
          </LoadingContainer>
        ) : welcomeError ? (
          <ErrorContainer>
            <p>{welcomeError}</p>
          </ErrorContainer>
        ) : welcomeText ? (
          <WelcomeSection>
            <SubSectionTitle>Boas Vindas</SubSectionTitle>
            <WelcomeText>
              {formatWelcomeText(welcomeText)}
            </WelcomeText>
          </WelcomeSection>
        ) : null}
        
        {/* Timeline de Eventos */}
        {isLoading ? (
          <LoadingContainer>
            <p>Carregando nossa história...</p>
          </LoadingContainer>
        ) : error ? (
          <ErrorContainer>
            <p>{error}</p>
          </ErrorContainer>
        ) : (
          <Timeline>
            {timelineEvents.map((event, index) => (
              <TimelineItem key={event.id || index}>
                <TimelineDot />
                <TimelineContent>
                  <TimelineImageWithFallback src={event.image} alt={event.title} />
                  <TimelineDate>{event.date}</TimelineDate>
                  <TimelineTitle>{event.title}</TimelineTitle>
                  <TimelineText>{event.text}</TimelineText>
                </TimelineContent>
              </TimelineItem>
            ))}
          </Timeline>
        )}
      </PageContent>
    </PageContainer>
  );
};

export default NossaHistoria;
