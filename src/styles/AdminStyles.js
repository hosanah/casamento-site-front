import styled from 'styled-components';
import { Link } from 'react-router-dom';

// Container principal para todas as páginas administrativas
export const AdminContainer = styled.div`
  display: flex;
  min-height: 100vh;
`;

// Sidebar padrão para todas as páginas administrativas
export const Sidebar = styled.div`
  width: 250px;
  background-color: var(--accent);
  color: var(--white);
  padding: 2rem 0;
`;

export const Logo = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  
  h1 {
    font-family: var(--font-serif);
    color: var(--white);
    font-size: 1.5rem;
    
    span {
      color: var(--primary);
    }
  }
`;

export const NavMenu = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

export const NavItem = styled.li`
  margin-bottom: 0.5rem;
`;

export const NavLink = styled(Link)`
  display: block;
  padding: 0.75rem 1.5rem;
  color: var(--white);
  text-decoration: none;
  transition: background-color 0.3s ease;
  
  &:hover, &.active {
    background-color: rgba(255, 255, 255, 0.1);
  }
  
  &.active {
    border-left: 3px solid var(--primary);
  }
`;

// Conteúdo principal para todas as páginas administrativas
export const Content = styled.div`
  flex: 1;
  padding: 2rem;
  background-color: var(--light-bg);
`;

export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

export const PageTitle = styled.h2`
  color: var(--accent);
  font-size: 1.8rem;
`;

// Botões padrão para todas as páginas administrativas
export const ActionButton = styled.button`
  background-color: var(--accent);
  color: var(--white);
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: var(--primary);
  }
`;

export const SecondaryButton = styled(ActionButton)`
  background: none;
  border: 1px solid var(--accent);
  color: var(--accent);
  
  &:hover {
    background-color: var(--accent);
    color: var(--white);
  }
`;

// Tabelas padrão para todas as páginas administrativas
export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: var(--white);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const Th = styled.th`
  text-align: left;
  padding: 1rem;
  background-color: var(--accent);
  color: var(--white);
`;

export const Td = styled.td`
  padding: 1rem;
  border-bottom: 1px solid rgba(182, 149, 192, 0.3);
`;

export const Tr = styled.tr`
  &:last-child td {
    border-bottom: none;
  }
  
  &:hover {
    background-color: var(--light-bg);
  }
`;

// Formulários padrão para todas as páginas administrativas
export const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--accent);
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid rgba(182, 149, 192, 0.3);
  border-radius: 4px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: var(--primary);
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid rgba(182, 149, 192, 0.3);
  border-radius: 4px;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: var(--primary);
  }
`;

export const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid rgba(182, 149, 192, 0.3);
  border-radius: 4px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: var(--primary);
  }
`;

// Mensagens padrão para todas as páginas administrativas
export const SuccessMessage = styled.div`
  background-color: #d4edda;
  color: #155724;
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1.5rem;
`;

export const ErrorMessage = styled.div`
  background-color: #f8d7da;
  color: #721c24;
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1.5rem;
`;

// Modais padrão para todas as páginas administrativas
export const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: ${props => props.show ? 'flex' : 'none'};
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

export const ModalContent = styled.div`
  background-color: var(--white);
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

export const ModalTitle = styled.h3`
  margin: 0;
  color: var(--accent);
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6c757d;
  
  &:hover {
    color: var(--accent);
  }
`;

export const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
`;

// Botões de ação para tabelas
export const EditButton = styled.button`
  background-color: var(--accent);
  color: var(--white);
  border: none;
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: var(--primary);
  }
`;

export const DeleteButton = styled.button`
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: #c82333;
  }
`;

// Paginação padrão para todas as páginas administrativas
export const Pagination = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 2rem;
`;

export const PageButton = styled.button`
  padding: 0.5rem 1rem;
  margin: 0 0.25rem;
  background-color: ${props => props.active ? 'var(--accent)' : 'var(--white)'};
  color: ${props => props.active ? 'var(--white)' : 'var(--accent)'};
  border: 1px solid rgba(182, 149, 192, 0.3);
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background-color: ${props => props.active ? 'var(--accent)' : 'var(--light-bg)'};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// Componentes para a página de login
export const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: var(--light-bg);
`;

export const LoginCard = styled.div`
  width: 100%;
  max-width: 400px;
  background-color: var(--white);
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 2rem;
`;

export const SubmitButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background-color: var(--accent);
  color: var(--white);
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: var(--primary);
  }
  
  &:disabled {
    background-color: rgba(182, 149, 192, 0.3);
    cursor: not-allowed;
  }
`;
