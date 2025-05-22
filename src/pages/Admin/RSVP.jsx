import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  AdminContainer,
  Sidebar,
  Logo,
  NavMenu,
  NavItem,
  NavLink,
  Content,
  Header,
  PageTitle,
  ActionButton,
  SecondaryButton,
  Table,
  Th,
  Td,
  Tr,
  Pagination,
  PageButton,
  SuccessMessage,
  ErrorMessage,
  DeleteButton,
  Modal,
  ModalContent,
  ModalTitle,
  ModalFooter
} from '../../styles/AdminStyles';
import styled from 'styled-components';

const SearchContainer = styled.div`
  display: flex;
  margin-bottom: 2rem;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 0.75rem;
  border: 1px solid rgba(182, 149, 192, 0.3);
  border-radius: 4px 0 0 4px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: var(--primary);
  }
`;

const SearchButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: var(--accent);
  color: var(--white);
  border: none;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: var(--primary);
  }
`;

const ConfirmationModal = styled(Modal)``;

const ModalText = styled.p`
  margin-bottom: 1.5rem;
`;

const ModalButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
`;

const CancelButton = styled.button`
  background-color: #6c757d;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background-color: #5a6268;
  }
`;

const ConfirmButton = styled.button`
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background-color: #c82333;
  }
`;

const RSVP = () => {
  const [rsvps, setRSVPs] = useState([]);
  const [filteredRSVPs, setFilteredRSVPs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [rsvpToDelete, setRsvpToDelete] = useState(null);
  
  useEffect(() => {
    fetchRSVPs();
  }, []);
  
  const fetchRSVPs = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3001/api/rsvp', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Garantir que a resposta seja sempre um array
      const responseData = Array.isArray(response.data) ? response.data : [];
      
      setRSVPs(responseData);
      setFilteredRSVPs(responseData);
    } catch (error) {
      console.error('Erro ao buscar RSVPs:', error);
      setError('Erro ao carregar RSVPs. Tente novamente mais tarde.');
      // Inicializar com arrays vazios em caso de erro
      setRSVPs([]);
      setFilteredRSVPs([]);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setFilteredRSVPs(rsvps);
      return;
    }
    
    // Garantir que rsvps seja um array antes de filtrar
    if (!Array.isArray(rsvps)) {
      setFilteredRSVPs([]);
      return;
    }
    
    const filtered = rsvps.filter(rsvp => 
      rsvp.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (rsvp.email && rsvp.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (rsvp.phone && rsvp.phone.includes(searchTerm))
    );
    
    setFilteredRSVPs(filtered);
    setCurrentPage(1);
  };
  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  
  const handleExportCSV = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3001/api/rsvp/export', {
        headers: {
          Authorization: `Bearer ${token}`
        },
        responseType: 'blob'
      });
      
      // Criar link para download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'rsvps.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      setSuccess('CSV exportado com sucesso!');
      
      // Limpar mensagem de sucesso após 3 segundos
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (error) {
      console.error('Erro ao exportar CSV:', error);
      setError('Erro ao exportar CSV. Tente novamente mais tarde.');
      
      // Limpar mensagem de erro após 3 segundos
      setTimeout(() => {
        setError('');
      }, 3000);
    }
  };
  
  const handleDeleteClick = (rsvp) => {
    setRsvpToDelete(rsvp);
    setShowModal(true);
  };
  
  const handleCancelDelete = () => {
    setShowModal(false);
    setRsvpToDelete(null);
  };
  
  const handleConfirmDelete = async () => {
    if (!rsvpToDelete) return;
    
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3001/api/rsvp/${rsvpToDelete.id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Atualizar a lista de RSVPs
      setRSVPs(prevRSVPs => Array.isArray(prevRSVPs) ? prevRSVPs.filter(rsvp => rsvp.id !== rsvpToDelete.id) : []);
      setFilteredRSVPs(prevRSVPs => Array.isArray(prevRSVPs) ? prevRSVPs.filter(rsvp => rsvp.id !== rsvpToDelete.id) : []);
      
      setSuccess('Confirmação de presença excluída com sucesso!');
      
      // Limpar mensagem de sucesso após 3 segundos
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (error) {
      console.error('Erro ao excluir RSVP:', error);
      setError('Erro ao excluir confirmação de presença. Tente novamente mais tarde.');
      
      // Limpar mensagem de erro após 3 segundos
      setTimeout(() => {
        setError('');
      }, 3000);
    } finally {
      setShowModal(false);
      setRsvpToDelete(null);
      setLoading(false);
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/admin/login';
  };
  
  // Garantir que filteredRSVPs seja sempre um array
  const safeFilteredRSVPs = Array.isArray(filteredRSVPs) ? filteredRSVPs : [];
  
  // Paginação
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = safeFilteredRSVPs.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(safeFilteredRSVPs.length / itemsPerPage);
  
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Data inválida';
    }
  };
  
  return (
    <AdminContainer>
      <Sidebar>
        <Logo>
          <h1>
            Marília <span>&</span> Iago
          </h1>
        </Logo>
        
        <NavMenu>
          <NavItem>
            <NavLink to="/admin">Dashboard</NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/admin/presentes">Presentes</NavLink>
          </NavItem>
          <NavItem>
                      <NavLink to="/admin/vendas">Vendas</NavLink>
                    </NavItem>
          <NavItem>
            <NavLink to="/admin/config">Configurações</NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/admin/conteudo">Conteúdo</NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/admin/historia">Nossa História</NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/admin/album">Álbum</NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/admin/rsvp" className="active">RSVPs</NavLink>
          </NavItem>
        </NavMenu>
      </Sidebar>
      
      <Content>
        <Header>
          <PageTitle>Confirmações de Presença</PageTitle>
          <div>
            <ActionButton onClick={handleExportCSV}>Exportar CSV</ActionButton>
            <SecondaryButton onClick={handleLogout} style={{ marginLeft: '1rem' }}>Sair</SecondaryButton>
          </div>
        </Header>
        
        {success && <SuccessMessage>{success}</SuccessMessage>}
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <SearchContainer>
          <SearchInput
            type="text"
            placeholder="Buscar por nome, email ou telefone..."
            value={searchTerm}
            onChange={handleSearchChange}
            onKeyPress={handleSearchKeyPress}
          />
          <SearchButton onClick={handleSearch}>Buscar</SearchButton>
        </SearchContainer>
        
        <Table>
          <thead>
            <tr>
              <Th>Nome</Th>
              <Th>Acompanhantes</Th>
              <Th>Contato</Th>
              <Th>Mensagem</Th>
              <Th>Data</Th>
              <Th>Ações</Th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <Tr>
                <Td colSpan="6" style={{ textAlign: 'center' }}>Carregando...</Td>
              </Tr>
            ) : Array.isArray(currentItems) && currentItems.length > 0 ? (
              currentItems.map(rsvp => (
                <Tr key={rsvp.id}>
                  <Td>{rsvp.name}</Td>
                  <Td>{rsvp.companions}</Td>
                  <Td>
                    {rsvp.email && <div>{rsvp.email}</div>}
                    {rsvp.phone && <div>{rsvp.phone}</div>}
                  </Td>
                  <Td>{rsvp.message || '-'}</Td>
                  <Td>{formatDate(rsvp.createdAt)}</Td>
                  <Td>
                    <DeleteButton onClick={() => handleDeleteClick(rsvp)}>
                      Excluir
                    </DeleteButton>
                  </Td>
                </Tr>
              ))
            ) : (
              <Tr>
                <Td colSpan="6" style={{ textAlign: 'center' }}>Nenhuma confirmação de presença encontrada.</Td>
              </Tr>
            )}
          </tbody>
        </Table>
        
        {totalPages > 1 && (
          <Pagination>
            <PageButton 
              onClick={() => paginate(currentPage - 1)} 
              disabled={currentPage === 1}
            >
              Anterior
            </PageButton>
            
            {[...Array(totalPages).keys()].map(number => (
              <PageButton
                key={number + 1}
                active={currentPage === number + 1}
                onClick={() => paginate(number + 1)}
              >
                {number + 1}
              </PageButton>
            ))}
            
            <PageButton 
              onClick={() => paginate(currentPage + 1)} 
              disabled={currentPage === totalPages}
            >
              Próxima
            </PageButton>
          </Pagination>
        )}
        
        {showModal && (
          <ConfirmationModal show={showModal} onClick={handleCancelDelete}>
            <ModalContent onClick={e => e.stopPropagation()}>
              <ModalTitle>Confirmar exclusão</ModalTitle>
              <ModalText>
                Tem certeza que deseja excluir a confirmação de presença de <strong>{rsvpToDelete?.name}</strong>?
                Esta ação não pode ser desfeita.
              </ModalText>
              <ModalButtons>
                <CancelButton onClick={handleCancelDelete}>Cancelar</CancelButton>
                <ConfirmButton onClick={handleConfirmDelete}>Excluir</ConfirmButton>
              </ModalButtons>
            </ModalContent>
          </ConfirmationModal>
        )}
      </Content>
    </AdminContainer>
  );
};

export default RSVP;
