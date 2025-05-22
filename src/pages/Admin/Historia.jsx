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
  FormGroup,
  Label,
  Input,
  TextArea,
  SuccessMessage,
  ErrorMessage,
  Table,
  Th,
  Td,
  Tr,
  EditButton,
  DeleteButton,
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  CloseButton
} from '../../styles/AdminStyles';
import styled from 'styled-components';

const EventsContainer = styled.div`
  margin-top: 2rem;
`;

const EventCard = styled.div`
  background-color: var(--white);
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  display: flex;
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const EventImage = styled.div`
  width: 150px;
  height: 150px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  @media (max-width: 768px) {
    width: 100%;
    height: 200px;
  }
`;

const EventImageFallback = styled.div`
  width: 150px;
  height: 150px;
  border-radius: 8px;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 0.9rem;
  text-align: center;
  flex-shrink: 0;
  
  @media (max-width: 768px) {
    width: 100%;
    height: 200px;
  }
`;

const EventInfo = styled.div`
  flex: 1;
`;

const EventDate = styled.div`
  color: var(--accent);
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const EventTitle = styled.h3`
  color: var(--text);
  font-size: 1.2rem;
  margin-bottom: 1rem;
`;

const EventText = styled.div`
  color: var(--text);
  margin-bottom: 1rem;
  line-height: 1.6;
`;

const EventActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
`;

const ImagePreview = styled.div`
  margin-top: 1rem;
  width: 100%;
  max-width: 300px;
  height: 200px;
  border: 1px dashed rgba(182, 149, 192, 0.3);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background-color: #f0f0f0;
  cursor: pointer;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ImageUploadButton = styled.button`
  margin-top: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: var(--accent);
  color: var(--white);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background-color: var(--primary);
  }
`;

const SubmitButton = styled.button`
  padding: 0.75rem 1.5rem;
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

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  background-color: var(--white);
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  h3 {
    color: var(--accent);
    margin-bottom: 1rem;
  }
  
  p {
    color: var(--text);
    margin-bottom: 1.5rem;
  }
`;

const Historia = () => {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' ou 'edit'
  const [currentEvent, setCurrentEvent] = useState({
    id: null,
    date: '',
    title: '',
    text: '',
    image: '',
    order: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  
  // Referência para o input de arquivo
  const fileInputRef = React.createRef();
  
  useEffect(() => {
    fetchEvents();
  }, []);
  
  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('http://localhost:3001/api/story-events');
      
      // Ordenar eventos por ordem e data
      const sortedEvents = response.data.sort((a, b) => {
        if (a.order !== b.order) {
          return a.order - b.order;
        }
        return new Date(a.createdAt) - new Date(b.createdAt);
      });
      
      setEvents(sortedEvents);
    } catch (error) {
      console.error('Erro ao buscar eventos:', error);
      setError('Erro ao carregar eventos. Tente novamente mais tarde.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleOpenModal = (mode, event = null) => {
    setModalMode(mode);
    
    if (mode === 'edit' && event) {
      setCurrentEvent({
        id: event.id,
        date: event.date || '',
        title: event.title || '',
        text: event.text || '',
        image: event.image || '',
        order: event.order || 0
      });
      setImagePreview(event.image || '');
    } else {
      setCurrentEvent({
        id: null,
        date: '',
        title: '',
        text: '',
        image: '',
        order: events.length
      });
      setImagePreview('');
    }
    
    setImageFile(null);
    setSuccess('');
    setError('');
    setShowModal(true);
  };
  
  const handleCloseModal = () => {
    setShowModal(false);
    setSuccess('');
    setError('');
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentEvent({
      ...currentEvent,
      [name]: value
    });
  };
  
  const handleImageClick = () => {
    fileInputRef.current.click();
  };
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Verificar tipo de arquivo
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Tipo de arquivo não suportado. Apenas imagens são permitidas.');
      return;
    }
    
    // Verificar tamanho do arquivo (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Arquivo muito grande. O tamanho máximo é 5MB.');
      return;
    }
    
    setImageFile(file);
    
    // Criar preview da imagem
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };
  
  const uploadImage = async () => {
    if (!imageFile) return null;
  
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
  
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:3001/api/story-events/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        }
      );
  
      if (!response.data?.imageUrl) {
        console.error('Resposta da API não contém `imageUrl`: ', response.data);
        throw new Error('Resposta da API inválida.');
      }
  
      return response.data.imageUrl;
    } catch (error) {
      console.error('Erro ao fazer upload da imagem:', error);
      throw new Error('Erro ao fazer upload da imagem. Tente novamente.');
    }
  };
  
  
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentEvent.date || !currentEvent.title || !currentEvent.text) {
      setError('Data, título e história são obrigatórios.');
      return;
    }
    
    setIsLoading(true);
    setSuccess('');
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      const headers = {
        Authorization: `Bearer ${token}`
      };
      
      // Fazer upload da imagem se houver uma nova
      let imageUrl = currentEvent.image;
      if (imageFile) {
        imageUrl = await uploadImage();
        if (!imageUrl) {
          throw new Error('Erro ao fazer upload da imagem.');
        }
      }
      
      const eventData = {
        ...currentEvent,
        image: imageUrl
      };
      
      if (modalMode === 'add') {
        await axios.post('http://localhost:3001/api/story-events', eventData, { headers });
        setSuccess('Evento adicionado com sucesso!');
      } else {
        await axios.put(`http://localhost:3001/api/story-events/${currentEvent.id}`, eventData, { headers });
        setSuccess('Evento atualizado com sucesso!');
      }
      
      fetchEvents();
      setTimeout(() => {
        handleCloseModal();
      }, 1500);
    } catch (error) {
      console.error('Erro ao salvar evento:', error);
      setError(error.message || 'Erro ao salvar evento. Tente novamente mais tarde.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este evento?')) {
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3001/api/story-events/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      fetchEvents();
      setSuccess('Evento excluído com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir evento:', error);
      setError('Erro ao excluir evento. Tente novamente mais tarde.');
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/admin/login';
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
            <NavLink to="/admin/historia" className="active">Nossa História</NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/admin/album">Álbum</NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/admin/rsvp">RSVPs</NavLink>
          </NavItem>
        </NavMenu>
      </Sidebar>
      
      <Content>
        <Header>
          <PageTitle>Nossa História</PageTitle>
          <div>
            <ActionButton onClick={() => handleOpenModal('add')}>Adicionar Evento</ActionButton>
            <SecondaryButton onClick={handleLogout} style={{ marginLeft: '1rem' }}>Sair</SecondaryButton>
          </div>
        </Header>
        
        {success && <SuccessMessage>{success}</SuccessMessage>}
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <EventsContainer>
          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>Carregando...</div>
          ) : events.length > 0 ? (
            events.map((event, index) => (
              <EventCard key={event.id}>
                {event.image ? (
                  <EventImage>
                    <img 
                      src={`http://localhost:3001${event.image}`}
                      alt={event.title}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentNode.innerHTML = `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#f0f0f0;color:#999;font-size:0.9rem;text-align:center;">Imagem não disponível</div>`;
                      }}
                    />
                  </EventImage>
                ) : (
                  <EventImageFallback>
                    Sem imagem
                  </EventImageFallback>
                )}
                
                <EventInfo>
                  <EventDate>{event.date}</EventDate>
                  <EventTitle>{event.title}</EventTitle>
                  <EventText>{event.text}</EventText>
                  <EventActions>
                    <EditButton onClick={() => handleOpenModal('edit', event)}>Editar</EditButton>
                    <DeleteButton onClick={() => handleDelete(event.id)}>Excluir</DeleteButton>
                  </EventActions>
                </EventInfo>
              </EventCard>
            ))
          ) : (
            <EmptyState>
              <h3>Nenhum evento cadastrado</h3>
              <p>Adicione eventos para contar a história do casal.</p>
              <ActionButton onClick={() => handleOpenModal('add')}>Adicionar Primeiro Evento</ActionButton>
            </EmptyState>
          )}
        </EventsContainer>
        
        <Modal show={showModal} onClick={handleCloseModal}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>{modalMode === 'add' ? 'Adicionar Evento' : 'Editar Evento'}</ModalTitle>
              <CloseButton onClick={handleCloseModal}>&times;</CloseButton>
            </ModalHeader>
            
            {success && <SuccessMessage>{success}</SuccessMessage>}
            {error && <ErrorMessage>{error}</ErrorMessage>}
            
            <form onSubmit={handleSubmit}>
              <FormGroup>
                <Label htmlFor="date">Data *</Label>
                <Input
                  type="text"
                  id="date"
                  name="date"
                  value={currentEvent.date}
                  onChange={handleChange}
                  placeholder="Ex: Janeiro de 2020"
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="title">Título *</Label>
                <Input
                  type="text"
                  id="title"
                  name="title"
                  value={currentEvent.title}
                  onChange={handleChange}
                  placeholder="Ex: Primeiro Encontro"
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="text">História *</Label>
                <TextArea
                  id="text"
                  name="text"
                  value={currentEvent.text}
                  onChange={handleChange}
                  placeholder="Conte a história deste evento..."
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="order">Ordem</Label>
                <Input
                  type="number"
                  id="order"
                  name="order"
                  value={currentEvent.order}
                  onChange={handleChange}
                  min="0"
                />
              </FormGroup>
              
              <FormGroup>
                <Label>Imagem</Label>
                <ImagePreview onClick={handleImageClick}>
                  {imagePreview ? (
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      onError={() => {
                        setImagePreview('');
                        setError('Erro ao carregar imagem. Tente novamente.');
                      }}
                    />
                  ) : (
                    <span>Clique para selecionar uma imagem</span>
                  )}
                </ImagePreview>
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  accept="image/*"
                  onChange={handleImageChange}
                />
                <ImageUploadButton type="button" onClick={handleImageClick}>
                  Selecionar Imagem
                </ImageUploadButton>
              </FormGroup>
              
              <SubmitButton type="submit" disabled={isLoading}>
                {isLoading ? 'Salvando...' : 'Salvar'}
              </SubmitButton>
            </form>
          </ModalContent>
        </Modal>
      </Content>
    </AdminContainer>
  );
};

export default Historia;
