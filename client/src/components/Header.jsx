import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useConfig } from '../contexts/ConfigContext';

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 100;
  background-color: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(5px);
  border-bottom: 1px solid rgba(182, 149, 192, 0.2);
  min-height: var(--header-height); 
  padding: 0 20px; 
  display: flex;
  align-items: center;
`;

const HeaderInner = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin: 0 auto;
  padding: 0 var(--container-padding);
`;

const Logo = styled(Link)`
  font-family: var(--font-serif);
  font-size: 1.8rem;
  color: var(--accent);
  text-decoration: none;
`;

const NavMenu = styled.ul`
  display: flex;
  justify-content: center;
  list-style: none;
  margin: 0;
  padding: 0;
  
  @media (max-width: 992px) {
    display: ${props => props.$isOpen ? 'flex' : 'none'};
    flex-direction: column;
    position: absolute;
    top: var(--header-height);
    left: 0;
    width: 100%;
    background-color: rgba(255, 255, 255, 0.95);
    padding: 20px 0;
    box-shadow: var(--shadow-md);
  }
`;

const NavItem = styled.li`
  margin: 0 15px;
  
  @media (max-width: 992px) {
    margin: 10px 0;
    text-align: center;
  }
`;

const NavLink = styled(Link)`
  font-family: var(--font-serif);
  font-size: 1.1rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  position: relative;
  color: ${props => props.active ? 'var(--primary)' : 'var(--accent)'};
  
  &::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: ${props => props.active ? '100%' : '0'};
    height: 1px;
    background-color: var(--primary);
    transition: width 0.3s ease;
  }
  
  &:hover::after {
    width: 100%;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: var(--accent);
  cursor: pointer;
  padding: 5px;
  
  @media (max-width: 992px) {
    display: block;
  }
  
  &:focus {
    outline: none;
  }
`;

const Header = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();
  const { config } = useConfig();
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  
  const isActive = (path) => {
    return location.pathname === path;
  };
  
  return (
    <HeaderContainer>
      <HeaderInner>
        <Logo to="/">{config.siteTitle}</Logo>
        
        <MobileMenuButton onClick={toggleMenu} aria-label="Menu de navegação">
          {isOpen ? '✕' : '☰'}
        </MobileMenuButton>
        
        <NavMenu $isOpen={isOpen}>
          <NavItem>
            <NavLink to="/" active={isActive('/')}>Home</NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/nossa-historia" active={isActive('/nossa-historia')}>Nossa História</NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/lista-de-presentes" active={isActive('/lista-de-presentes')}>Lista de Presentes</NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/confirme-sua-presenca" active={isActive('/confirme-sua-presenca')}>Confirme sua Presença</NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/informacoes" active={isActive('/informacoes')}>Informações</NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/album" active={isActive('/album')}>Álbum</NavLink>
          </NavItem>
        </NavMenu>
      </HeaderInner>
    </HeaderContainer>
  );
};

export default Header;
