import React, { useState, useEffect, useCallback } from 'react';
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
  FormGroup,
  Label,
  Input,
  TextArea,
  SuccessMessage,
  ErrorMessage,
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  CloseButton,
  EditButton,
  DeleteButton
} from '../../styles/AdminStyles';
import styled from 'styled-components';

const PresenteImage = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
  background-color: #f0f0f0;
`;

const PresenteImageFallback = styled.div`
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f0f0f0;
  color: #999;
  font-size: 0.7rem;
  border-radius: 4px;
  text-align: center;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
`;

const ImagePreview = styled.div`
  margin-top: 1rem;
  width: 100%;
  max-width: 200px;
  height: 150px;
  border: 1px dashed rgba(182, 149, 192, 0.3);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background-color: #f0f0f0;
  
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

// Componente de imagem com tratamento de erro para a tabela
const PresenteImageWithFallback = ({ src, alt }) => {
  const [hasError, setHasError] = useState(false);
  
  if (hasError || !src) {
    return <PresenteImageFallback>{alt || 'Sem imagem'}</PresenteImageFallback>;
  }
  
  return (
    <PresenteImage 
      src={`http://localhost:3001${src}`}
      alt={alt}
      onError={() => setHasError(true)}
    />
  );
};

// Componente de preview de imagem com tratamento de erro para o modal
const ImagePreviewWithFallback = ({ src, alt, onClick }) => {
  const [hasError, setHasError] = useState(false);
  
  if (!src) {
    return (
      <ImagePreview onClick={onClick}>
        <span>Clique para selecionar uma imagem</span>
      </ImagePreview>
    );
  }
  
  if (hasError) {
    return (
      <ImagePreview onClick={onClick}>
        <span>Imagem não disponível. Clique para selecionar outra.</span>
      </ImagePreview>
    );
  }
  
  return (
    <ImagePreview onClick={onClick}>
      <img 
        src={src} 
        alt={alt || 'Preview'} 
        onError={() => setHasError(true)}
      />
    </ImagePreview>
  );
};

const Presentes = () => {
  const [presentes, setPresentes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' ou 'edit'
  const [currentPresente, setCurrentPresente] = useState({
    id: null,
    name: '',
    description: '',
    price: '',
    image: '',
    stock: 1
  });
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  
  // Referência para o input de arquivo
  const fileInputRef = React.createRef();
  
  // Usando useCallback para evitar recriação da função a cada render
  const fetchPresentes = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/presentes');
      setPresentes(response.data);
    } catch (error) {
      console.error('Erro ao buscar presentes:', error);
      setError('Erro ao carregar presentes. Tente novamente mais tarde.');
    }
  }, []);
  
  useEffect(() => {
    // Usando uma flag para garantir que a chamada só aconteça uma vez
    let isMounted = true;
    
    const loadData = async () => {
      if (isMounted) {
        await fetchPresentes();
      }
    };
    
    loadData();
    
    // Cleanup function para evitar memory leaks
    return () => {
      isMounted = false;
    };
  }, [fetchPresentes]);
  
  const handleOpenModal = (mode, presente = null) => {
    setModalMode(mode);
    
    if (mode === 'edit' && presente) {
      setCurrentPresente({
        id: presente.id,
        name: presente.name,
        description: presente.description || '',
        price: presente.price.toString(),
        image: presente.image || '',
        stock: presente.stock
      });
      setImagePreview(presente.image || '');
    } else {
      setCurrentPresente({
        id: null,
        name: '',
        description: '',
        price: '',
        image: '',
        stock: 1
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
    setCurrentPresente({
      ...currentPresente,
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
      setUploadingImage(true);
      
      const formData = new FormData();
      formData.append('image', imageFile);
      
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:3001/api/presentes/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
      
      return response.data.url;
    } catch (error) {
      console.error('Erro ao fazer upload da imagem:', error);
      throw new Error('Erro ao fazer upload da imagem. Tente novamente.');
    } finally {
      setUploadingImage(false);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentPresente.name || !currentPresente.price) {
      setError('Nome e preço são obrigatórios.');
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
      let imageUrl = currentPresente.image;
      if (imageFile) {
        imageUrl = await uploadImage();
        if (!imageUrl) {
          throw new Error('Erro ao fazer upload da imagem.');
        }
      }
      
      const presenteData = {
        ...currentPresente,
        image: imageUrl
      };
      
      if (modalMode === 'add') {
        await axios.post('http://localhost:3001/api/presentes', presenteData, { headers });
        setSuccess('Presente adicionado com sucesso!');
      } else {
        await axios.put(`http://localhost:3001/api/presentes/${currentPresente.id}`, presenteData, { headers });
        setSuccess('Presente atualizado com sucesso!');
      }
      
      fetchPresentes();
      setTimeout(() => {
        handleCloseModal();
      }, 1500);
    } catch (error) {
      console.error('Erro ao salvar presente:', error);
      setError(error.message || 'Erro ao salvar presente. Tente novamente mais tarde.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este presente?')) {
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3001/api/presentes/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      fetchPresentes();
      setSuccess('Presente excluído com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir presente:', error);
      setError('Erro ao excluir presente. Tente novamente mais tarde.');
    }
  };
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
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
            <NavLink to="/admin/presentes" className="active">Presentes</NavLink>
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
            <NavLink to="/admin/rsvp">RSVPs</NavLink>
          </NavItem>
        </NavMenu>
      </Sidebar>
      
      <Content>
        <Header>
          <PageTitle>Gerenciar Presentes</PageTitle>
          <div>
            <ActionButton onClick={() => handleOpenModal('add')}>Adicionar Presente</ActionButton>
            <SecondaryButton onClick={handleLogout} style={{ marginLeft: '1rem' }}>Sair</SecondaryButton>
          </div>
        </Header>
        
        {success && <SuccessMessage>{success}</SuccessMessage>}
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <Table>
          <thead>
            <tr>
              <Th>Imagem</Th>
              <Th>Nome</Th>
              <Th>Preço</Th>
              <Th>Estoque</Th>
              <Th>Ações</Th>
            </tr>
          </thead>
          <tbody>
            {presentes.length > 0 ? (
              presentes.map(presente => (
                <Tr key={presente.id}>
                  <Td>
                    <PresenteImageWithFallback 
                      src={presente.image} 
                      alt={presente.name}
                    />
                  </Td>
                  <Td>{presente.name}</Td>
                  <Td>{formatPrice(presente.price)}</Td>
                  <Td>{presente.stock}</Td>
                  <Td>
                    <ActionButtons>
                      <EditButton onClick={() => handleOpenModal('edit', presente)}>Editar</EditButton>
                      <DeleteButton onClick={() => handleDelete(presente.id)}>Excluir</DeleteButton>
                    </ActionButtons>
                  </Td>
                </Tr>
              ))
            ) : (
              <Tr>
                <Td colSpan="5" style={{ textAlign: 'center' }}>Nenhum presente cadastrado.</Td>
              </Tr>
            )}
          </tbody>
        </Table>
        
        <Modal show={showModal} onClick={handleCloseModal}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>{modalMode === 'add' ? 'Adicionar Presente' : 'Editar Presente'}</ModalTitle>
              <CloseButton onClick={handleCloseModal}>&times;</CloseButton>
            </ModalHeader>
            
            {success && <SuccessMessage>{success}</SuccessMessage>}
            {error && <ErrorMessage>{error}</ErrorMessage>}
            
            <form onSubmit={handleSubmit}>
              <FormGroup>
                <Label htmlFor="name">Nome *</Label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  value={currentPresente.name}
                  onChange={handleChange}
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="description">Descrição</Label>
                <TextArea
                  id="description"
                  name="description"
                  value={currentPresente.description}
                  onChange={handleChange}
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="price">Preço *</Label>
                <Input
                  type="number"
                  id="price"
                  name="price"
                  value={currentPresente.price}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="stock">Estoque</Label>
                <Input
                  type="number"
                  id="stock"
                  name="stock"
                  value={currentPresente.stock}
                  onChange={handleChange}
                  min="0"
                />
              </FormGroup>
              
              <FormGroup>
                <Label>Imagem</Label>
                <ImagePreviewWithFallback
                  src={imagePreview}
                  alt={currentPresente.name}
                  onClick={handleImageClick}
                />
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
              
              <SubmitButton type="submit" disabled={isLoading || uploadingImage}>
                {isLoading ? 'Salvando...' : 'Salvar'}
              </SubmitButton>
            </form>
          </ModalContent>
        </Modal>
      </Content>
    </AdminContainer>
  );
};

export default Presentes;
