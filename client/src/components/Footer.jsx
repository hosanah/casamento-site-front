import React from 'react';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';
import { useConfig } from '../contexts/ConfigContext';

const FooterContainer = styled.footer`
  background-color: var(--accent);
  color: var(--white);
  padding: 3rem 0 1.5rem;
  margin-top: 3rem;
  position: relative;
  width: 100%;
  overflow: hidden;
`;

const FooterContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const Names = styled.h3`
  font-family: 'Cormorant Garamond', serif;
  font-size: 2rem;
  margin-bottom: 1rem;
  
  span {
    color: var(--primary);
  }
`;

const Copyright = styled.p`
  font-size: 0.9rem;
  opacity: 0.8;
  margin-top: 1.5rem;
`;

const EventDate = styled.div`
  font-size: 1.2rem;
  margin-top: 10px;
  font-family: 'Cormorant Garamond', serif;
  letter-spacing: 1px;
`;

const FloralDecoration = styled.div`
  position: absolute;
  width: 150px;
  height: 150px;
  opacity: 0.1;
  background-size: contain;
  background-repeat: no-repeat;
  
  &.top-left {
    top: 20px;
    left: 20px;
    background-position: top left;
  }
  
  &.bottom-right {
    bottom: 20px;
    right: 20px;
    background-position: bottom right;
    transform: rotate(180deg);
  }
`;

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const location = useLocation();
  const { config } = useConfig();
  
  // Não mostrar o footer nas páginas de admin
  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  // Formatar a data do casamento para exibição
  const formattedDate = React.useMemo(() => {
    if (!config.weddingDate) return '20 de setembro de 2025, às 19:00';
    
    try {
      const date = new Date(config.weddingDate);
      const options = { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric'
      };
      return new Intl.DateTimeFormat('pt-BR', options).format(date);
    } catch (err) {
      console.error('Erro ao formatar data:', err);
      return config.weddingDate;
    }
  }, [config.weddingDate]);
  
  return (
    <FooterContainer>
      <FloralDecoration className="top-left" />
      <FloralDecoration className="bottom-right" />
      <FooterContent>
        <Names>
          <span>{config.siteTitle}</span>
        </Names>
        <EventDate>{formattedDate}</EventDate>
        <Copyright>
          © Zapchatbr {currentYear} - Todos os direitos reservados
        </Copyright>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer;
