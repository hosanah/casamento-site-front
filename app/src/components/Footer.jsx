import React from 'react';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';

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
  
  // Não mostrar o footer nas páginas de admin
  if (location.pathname.startsWith('/admin')) {
    return null;
  }
  
  return (
    <FooterContainer>
      <FloralDecoration className="top-left" />
      <FloralDecoration className="bottom-right" />
      <FooterContent>
        <Names>
          Marília <span>&</span> Iago
        </Names>
        <EventDate>20 de Setembro de 2025</EventDate>
        <Copyright>
          © {currentYear} - Todos os direitos reservados
        </Copyright>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer;
