import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useConfig } from '../contexts/ConfigContext';
import axios from 'axios';

const HomeContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const HeroSection = styled.section`
  height: calc(100vh - var(--header-height));
  width: 100%;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  text-align: center;
  color: var(--white);
  padding: 0;
  overflow: hidden;
`;

const BackgroundSlide = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url(${props => props.image});
  background-size: cover;
  background-position: center;
  opacity: ${props => props.active ? 1 : 0};
  transition: opacity 1s ease-in-out;
  z-index: 0;
`;

const HeroOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, rgba(80, 52, 89, 0.5), rgba(66, 89, 67, 0.5));
  z-index: 1;
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: var(--container-width);
  padding: 0 var(--container-padding);
`;

const HeroTitle = styled.h1`
  font-size: 4.5rem;
  margin-bottom: 1rem;
  color: var(--white);
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  font-family: var(--font-serif);
  
  @media (max-width: 768px) {
    font-size: 3rem;
  }
  
  @media (max-width: 576px) {
    font-size: 2.5rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.8rem;
  margin-bottom: 2rem;
  font-weight: 300;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
  
  @media (max-width: 576px) {
    font-size: 1.3rem;
  }
`;

const HeroDate = styled.div`
  font-family: var(--font-serif);
  font-size: 2rem;
  margin-bottom: 2rem;
  letter-spacing: 2px;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
  
  @media (max-width: 576px) {
    font-size: 1.3rem;
    letter-spacing: 1px;
  }
`;

const CountdownContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: 30px 0;
  
  @media (max-width: 576px) {
    flex-wrap: wrap;
  }
`;

const CountdownItem = styled.div`
  margin: 0 15px;
  text-align: center;
  
  @media (max-width: 576px) {
    margin: 10px;
  }
`;

const CountdownNumber = styled.div`
  font-size: 3rem;
  font-weight: 700;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 5px;
  padding: 10px 20px;
  min-width: 100px;
  display: inline-block;
  backdrop-filter: blur(5px);
  
  @media (max-width: 768px) {
    font-size: 2rem;
    min-width: 80px;
    padding: 8px 15px;
  }
  
  @media (max-width: 576px) {
    font-size: 1.5rem;
    min-width: 60px;
    padding: 5px 10px;
  }
`;

const CountdownLabel = styled.div`
  font-size: 1rem;
  margin-top: 10px;
  text-transform: uppercase;
  letter-spacing: 1px;
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const HeroButton = styled(Link)`
  background-color: var(--primary);
  color: var(--white);
  padding: 15px 30px;
  font-size: 1.1rem;
  border-radius: 4px;
  display: inline-block;
  transition: var(--transition);
  border: 2px solid var(--primary);
  text-decoration: none;
  
  &:hover {
    background-color: transparent;
    color: var(--white);
    border-color: var(--white);
  }
  
  @media (max-width: 768px) {
    padding: 12px 25px;
    font-size: 1rem;
  }
`;

const Home = () => {
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const { config, formatWeddingDate } = useConfig();
  
  // Estado para o slideshow
  const [backgroundImages, setBackgroundImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  // Buscar imagens de fundo ativas
  useEffect(() => {
    const fetchBackgroundImages = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/background-images/active');
        if (response.data && response.data.length > 0) {
          setBackgroundImages(response.data);
        } else {
          // Fallback para imagem padrão se não houver imagens cadastradas
          setBackgroundImages([{ 
            id: 0, 
            path: '/images/couple-background.png',
            active: true
          }]);
        }
      } catch (error) {
        console.error('Erro ao buscar imagens de fundo:', error);
        // Fallback para imagem padrão em caso de erro
        setBackgroundImages([{ 
          id: 0, 
          path: '/images/couple-background.png',
          active: true
        }]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBackgroundImages();
  }, []);
  
  // Rotação automática das imagens a cada 3 segundos
  useEffect(() => {
    if (backgroundImages.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentImageIndex(prevIndex => 
        prevIndex === backgroundImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);
    
    return () => clearInterval(interval);
  }, [backgroundImages]);
  
  // Countdown para a data do casamento
  useEffect(() => {
    // Usar a data do casamento do contexto, ou fallback para uma data padrão
    const weddingDateStr = config.weddingDate || 'September 20, 2025 19:00:00';
    const weddingDate = new Date(weddingDateStr).getTime();
    
    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = weddingDate - now;
      
      // Verificar se a data já passou
      if (distance < 0) {
        setDays(0);
        setHours(0);
        setMinutes(0);
        setSeconds(0);
        return;
      }
      
      setDays(Math.floor(distance / (1000 * 60 * 60 * 24)));
      setHours(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
      setMinutes(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)));
      setSeconds(Math.floor((distance % (1000 * 60)) / 1000));
    };
    
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    
    return () => clearInterval(interval);
  }, [config.weddingDate]);
  
  // Formatar a data do casamento para exibição
  const formattedDate = React.useMemo(() => {
    if (!config.weddingDate) return '20 de setembro de 2025, às 19:00';
    
    try {
      const date = new Date(config.weddingDate);
      const options = { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      };
      return new Intl.DateTimeFormat('pt-BR', options).format(date);
    } catch (err) {
      console.error('Erro ao formatar data:', err);
      return config.weddingDate;
    }
  }, [config.weddingDate]);
  
  return (
    <HomeContainer>
      <HeroSection>
        {/* Slideshow de imagens de fundo */}
        {backgroundImages.map((image, index) => (
          <BackgroundSlide
            key={image.id}
            image={`http://localhost:3001${image.path}`}
            active={index === currentImageIndex}
          />
        ))}
        
        <HeroOverlay />
        <HeroContent>
          <HeroTitle className="fade-in">{config.siteTitle || 'Marília & Iago'}</HeroTitle>
          <HeroSubtitle className="fade-in delay-1">
            Estamos muito felizes em ter você aqui!
          </HeroSubtitle>
          <HeroDate className="fade-in delay-2">
            {formattedDate}
          </HeroDate>
          
          <CountdownContainer className="fade-in delay-3">
            <CountdownItem>
              <CountdownNumber>{days}</CountdownNumber>
              <CountdownLabel>Dias</CountdownLabel>
            </CountdownItem>
            <CountdownItem>
              <CountdownNumber>{hours}</CountdownNumber>
              <CountdownLabel>Horas</CountdownLabel>
            </CountdownItem>
            <CountdownItem>
              <CountdownNumber>{minutes}</CountdownNumber>
              <CountdownLabel>Minutos</CountdownLabel>
            </CountdownItem>
            <CountdownItem>
              <CountdownNumber>{seconds}</CountdownNumber>
              <CountdownLabel>Segundos</CountdownLabel>
            </CountdownItem>
          </CountdownContainer>
          
          <HeroButton to="/confirme-sua-presenca" className="fade-in delay-3">
            Confirme sua presença
          </HeroButton>
        </HeroContent>
      </HeroSection>
    </HomeContainer>
  );
};

export default Home;
