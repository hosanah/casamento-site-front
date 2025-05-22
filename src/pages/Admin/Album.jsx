import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
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
  Select,
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

const TabsContainer = styled.div`
  display: flex;
  margin-bottom: 2rem;
  border-bottom: 1px solid rgba(182, 149, 192, 0.3);
  flex-wrap: wrap;
`;

const Tab = styled.button`
  padding: 1rem 2rem;
  background: none;
  border: none;
  font-size: 1.1rem;
  font-weight: ${props => props.active ? '600' : '400'};
  color: ${props => props.active ? 'var(--accent)' : 'var(--text)'};
  position: relative;
  cursor: pointer;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 100%;
    height: 3px;
    background-color: var(--accent);
    opacity: ${props => props.active ? '1' : '0'};
    transition: opacity 0.3s ease;
  }
`;

const PhotoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  
  @media (max-width: 992px) {
    grid-template-columns: repeat(3, 1fr);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

const PhotoCard = styled.div`
  background-color: var(--white);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
  opacity: ${props => props.inactive ? 0.6 : 1};
  cursor: move;
  
  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
`;

const PhotoImage = styled.div`
  width: 100%;
  height: 200px;
  background-color: ${props => props.hasError ? '#f0f0f0' : 'transparent'};
  display: flex;
  align-items: center;
  justify-content: center;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const PhotoInfo = styled.div`
  padding: 1rem;
`;

const PhotoTitle = styled.h3`
  font-size: 1rem;
  margin-bottom: 0.5rem;
  color: var(--accent);
`;

const PhotoActions = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
`;

const OrderBadge = styled.div`
  position: absolute;
  top: 0.5rem;
  left: 0.5rem;
  background-color: var(--accent);
  color: var(--white);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
`;

const StatusBadge = styled.div`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background-color: ${props => props.active ? 'var(--success)' : 'var(--danger)'};
  color: var(--white);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
`;

const ToggleButton = styled.button`
  background-color: ${props => props.active ? 'var(--success)' : 'var(--danger)'};
  color: var(--white);
  border: none;
  border-radius: 4px;
  padding: 0.5rem;
  font-size: 0.8rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
  
  &:hover {
    opacity: 0.9;
  }
`;

const DropZone = styled.div`
  border: 2px dashed ${props => props.isDragActive ? 'var(--accent)' : 'rgba(182, 149, 192, 0.3)'};
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  background-color: ${props => props.isDragActive ? 'rgba(182, 149, 192, 0.1)' : 'transparent'};
  margin-bottom: 2rem;
  transition: all 0.3s ease;
  cursor: pointer;
  
  p {
    margin-bottom: 1rem;
    color: var(--text);
  }
  
  strong {
    color: var(--accent);
  }
`;

const PreviewGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 1rem;
  margin-top: 1.5rem;
  
  @media (max-width: 992px) {
    grid-template-columns: repeat(4, 1fr);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
  
  @media (max-width: 576px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const PreviewItem = styled.div`
  position: relative;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  img {
    width: 100%;
    height: 100px;
    object-fit: cover;
  }
  
  button {
    position: absolute;
    top: 0.25rem;
    right: 0.25rem;
    background-color: var(--danger);
    color: white;
    border: none;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    opacity: 0.8;
    
    &:hover {
      opacity: 1;
    }
  }
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background-color: #e0e0e0;
  border-radius: 4px;
  margin-top: 1rem;
  overflow: hidden;
  
  div {
    height: 100%;
    background-color: var(--accent);
    width: ${props => props.progress}%;
    transition: width 0.3s ease;
  }
`;

const UploadButton = styled.button`
  margin-top: 1rem;
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
  grid-column: 1 / -1;
  
  h3 {
    color: var(--accent);
    margin-bottom: 1rem;
  }
  
  p {
    color: var(--text);
    margin-bottom: 1.5rem;
  }
`;

// Componente seguro para exibir imagens
const SafeImage = ({ src, alt, className, style }) => {
  const [hasError, setHasError] = useState(false);
  
  // Reset error state when src changes
  useEffect(() => {
    setHasError(false);
  }, [src]);
  
  if (hasError || !src) {
    return (
      <div 
        className={className} 
        style={{ 
          ...style, 
          backgroundColor: '#f0f0f0', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          color: '#999',
          fontSize: '0.8rem'
        }}
      >
        Imagem não disponível
      </div>
    );
  }
  
  return (
    <img
      src={`http://localhost:3001${src}`}
      alt={alt}
      className={className}
      style={style}
      onError={() => setHasError(true)}
    />
  );
};

// Componente de item arrastável
const DraggablePhotoCard = ({ photo, index, movePhoto, handleOpenModal, handleDelete, handleToggleActive }) => {
  const ref = useRef(null);
  
  const [{ isDragging }, drag] = useDrag({
    type: 'PHOTO',
    item: { id: photo.id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  
  const [, drop] = useDrop({
    accept: 'PHOTO',
    hover: (item, monitor) => {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      
      // Não substituir itens consigo mesmos
      if (dragIndex === hoverIndex) {
        return;
      }
      
      // Determinar retângulo na tela
      const hoverBoundingRect = ref.current.getBoundingClientRect();
      
      // Obter posição vertical do meio
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      
      // Determinar posição do mouse
      const clientOffset = monitor.getClientOffset();
      
      // Obter pixels para o topo
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      
      // Apenas realizar a movimentação quando o mouse cruzar metade da altura do item
      // Quando arrastar para baixo, apenas mover quando o cursor estiver abaixo de 50%
      // Quando arrastar para cima, apenas mover quando o cursor estiver acima de 50%
      
      // Arrastando para baixo
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      
      // Arrastando para cima
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      
      // Executar a ação
      movePhoto(dragIndex, hoverIndex);
      
      // Atualizar o índice para o item arrastado
      item.index = hoverIndex;
    },
  });
  
  // Aplicar os refs de drag e drop ao elemento
  drag(drop(ref));
  
  return (
    <PhotoCard 
      ref={ref} 
      inactive={!photo.active}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <OrderBadge>{index + 1}</OrderBadge>
      <StatusBadge active={photo.active}>
        {photo.active ? 'Ativo' : 'Inativo'}
      </StatusBadge>
      <PhotoImage>
        <SafeImage 
          src={photo.image || '/images/placeholder.jpg'} 
          alt={photo.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </PhotoImage>
      <PhotoInfo>
        <PhotoTitle>{photo.title || `Foto ${index + 1}`}</PhotoTitle>
        <PhotoActions>
          <EditButton onClick={() => handleOpenModal('edit', photo)}>Editar</EditButton>
          <ToggleButton 
            active={photo.active}
            onClick={() => handleToggleActive(photo.id, !photo.active)}
          >
            {photo.active ? 'Desativar' : 'Ativar'}
          </ToggleButton>
          <DeleteButton onClick={() => handleDelete(photo.id)}>Excluir</DeleteButton>
        </PhotoActions>
      </PhotoInfo>
    </PhotoCard>
  );
};

const Album = () => {
  const [activeGallery, setActiveGallery] = useState('preWedding');
  const [photos, setPhotos] = useState({
    preWedding: [],
    momentos: [],
    padrinhos: [],
    festa: []
  });
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [currentPhoto, setCurrentPhoto] = useState({
    id: null,
    gallery: 'preWedding',
    image: '',
    title: '',
    order: 0,
    active: true
  });
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploadFiles, setUploadFiles] = useState([]);
  const [uploadPreviews, setUploadPreviews] = useState([]);
  const [isDragActive, setIsDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [dataFetched, setDataFetched] = useState(false);
  
  // Referências para os inputs de arquivo
  const fileInputRef = useRef(null);
  const multipleFileInputRef = useRef(null);
  
  // Função memoizada para buscar fotos
  const fetchPhotos = useCallback(async () => {
    if (dataFetched) return;
    
    try {
      setIsLoading(true);
      const response = await axios.get('http://localhost:3001/api/album');
      if (response.data) {
        setPhotos(response.data);
        setDataFetched(true);
      }
    } catch (error) {
      console.error('Erro ao buscar fotos:', error);
      setError('Erro ao carregar fotos. Tente novamente mais tarde.');
    } finally {
      setIsLoading(false);
    }
  }, [dataFetched]);
  
  // Efeito para buscar fotos apenas na montagem do componente
  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);
  
  const handleGalleryChange = (gallery) => {
    setActiveGallery(gallery);
    setSuccess('');
    setError('');
  };
  
  const handleOpenModal = (mode, photo = null) => {
    setModalMode(mode);
    
    if (mode === 'edit' && photo) {
      setCurrentPhoto({
        id: photo.id,
        gallery: photo.gallery,
        image: photo.image,
        title: photo.title || '',
        order: photo.order,
        active: photo.active !== undefined ? photo.active : true
      });
      setImagePreview(photo.image || '');
    } else {
      setCurrentPhoto({
        id: null,
        gallery: activeGallery,
        image: '',
        title: '',
        order: photos[activeGallery] ? photos[activeGallery].length : 0,
        active: true
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
    setCurrentPhoto({
      ...currentPhoto,
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
      formData.append('images', imageFile);
      
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:3001/api/album/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
      
      return response.data.files[0].path;
    } catch (error) {
      console.error('Erro ao fazer upload da imagem:', error);
      throw new Error('Erro ao fazer upload da imagem. Tente novamente.');
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentPhoto.image && !imageFile) {
      setError('URL da imagem é obrigatória.');
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
      let imageUrl = currentPhoto.image;
      if (imageFile) {
        imageUrl = await uploadImage();
        if (!imageUrl) {
          throw new Error('Erro ao fazer upload da imagem.');
        }
      }
      
      const photoData = {
        ...currentPhoto,
        image: imageUrl
      };
      
      if (modalMode === 'add') {
        await axios.post('http://localhost:3001/api/album', photoData, { headers });
        setSuccess('Foto adicionada com sucesso!');
      } else {
        await axios.put(`http://localhost:3001/api/album/${currentPhoto.id}`, photoData, { headers });
        setSuccess('Foto atualizada com sucesso!');
      }
      
      // Buscar fotos novamente após salvar
      setDataFetched(false);
      await fetchPhotos();
      
      setTimeout(() => {
        handleCloseModal();
      }, 1500);
    } catch (error) {
      console.error('Erro ao salvar foto:', error);
      setError(error.message || 'Erro ao salvar foto. Tente novamente mais tarde.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir esta foto?')) {
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3001/api/album/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setSuccess('Foto excluída com sucesso!');
      // Buscar fotos novamente após excluir
      setDataFetched(false);
      await fetchPhotos();
    } catch (error) {
      console.error('Erro ao excluir foto:', error);
      setError('Erro ao excluir foto. Tente novamente mais tarde.');
    }
  };
  
  const handleToggleActive = async (id, active) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:3001/api/album/${id}/toggle-active`, 
        { active },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      setSuccess(`Foto ${active ? 'ativada' : 'desativada'} com sucesso!`);
      // Buscar fotos novamente após alterar status
      setDataFetched(false);
      await fetchPhotos();
    } catch (error) {
      console.error('Erro ao alterar status da foto:', error);
      setError('Erro ao alterar status da foto. Tente novamente mais tarde.');
    }
  };
  
  const movePhoto = (dragIndex, hoverIndex) => {
    const draggedPhoto = photos[activeGallery][dragIndex];
    const updatedPhotos = [...photos[activeGallery]];
    
    // Remover o item arrastado
    updatedPhotos.splice(dragIndex, 1);
    // Inserir o item arrastado na nova posição
    updatedPhotos.splice(hoverIndex, 0, draggedPhoto);
    
    // Atualizar o estado com a nova ordem
    setPhotos({
      ...photos,
      [activeGallery]: updatedPhotos
    });
  };
  
  const handleReorder = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Reordenar fotos da galeria atual
      const updatedPhotos = [...photos[activeGallery]].map((photo, index) => ({
        ...photo,
        order: index
      }));
      
      await axios.put('http://localhost:3001/api/album/reorder', {
        photos: updatedPhotos
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setSuccess('Ordem das fotos atualizada com sucesso!');
      // Buscar fotos novamente após reordenar
      setDataFetched(false);
      await fetchPhotos();
    } catch (error) {
      console.error('Erro ao reordenar fotos:', error);
      setError('Erro ao reordenar fotos. Tente novamente mais tarde.');
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/admin/login';
  };
  
  // Funções para upload múltiplo
  const handleMultipleFileSelect = () => {
    multipleFileInputRef.current.click();
  };
  
  const handleMultipleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    // Verificar tipos e tamanhos
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const validFiles = files.filter(file => {
      if (!allowedTypes.includes(file.type)) {
        console.warn(`Arquivo ${file.name} ignorado: tipo não suportado`);
        return false;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        console.warn(`Arquivo ${file.name} ignorado: tamanho excede 5MB`);
        return false;
      }
      
      return true;
    });
    
    if (validFiles.length === 0) {
      setError('Nenhum arquivo válido selecionado. Apenas imagens até 5MB são permitidas.');
      return;
    }
    
    // Adicionar aos arquivos existentes
    setUploadFiles(prevFiles => [...prevFiles, ...validFiles]);
    
    // Criar previews
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadPreviews(prevPreviews => [
          ...prevPreviews,
          {
            file: file,
            preview: reader.result,
            name: file.name
          }
        ]);
      };
      reader.readAsDataURL(file);
    });
  };
  
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };
  
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length === 0) return;
    
    // Verificar tipos e tamanhos
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const validFiles = files.filter(file => {
      if (!allowedTypes.includes(file.type)) {
        console.warn(`Arquivo ${file.name} ignorado: tipo não suportado`);
        return false;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        console.warn(`Arquivo ${file.name} ignorado: tamanho excede 5MB`);
        return false;
      }
      
      return true;
    });
    
    if (validFiles.length === 0) {
      setError('Nenhum arquivo válido selecionado. Apenas imagens até 5MB são permitidas.');
      return;
    }
    
    // Adicionar aos arquivos existentes
    setUploadFiles(prevFiles => [...prevFiles, ...validFiles]);
    
    // Criar previews
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadPreviews(prevPreviews => [
          ...prevPreviews,
          {
            file: file,
            preview: reader.result,
            name: file.name
          }
        ]);
      };
      reader.readAsDataURL(file);
    });
  };
  
  const removePreview = (index) => {
    setUploadPreviews(prevPreviews => prevPreviews.filter((_, i) => i !== index));
    setUploadFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };
  
  const handleMultipleUpload = async () => {
    if (uploadFiles.length === 0) {
      setError('Selecione pelo menos uma imagem para enviar.');
      return;
    }
    
    setIsUploading(true);
    setUploadProgress(0);
    setSuccess('');
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      
      // Fazer upload das imagens
      const formData = new FormData();
      uploadFiles.forEach(file => {
        formData.append('images', file);
      });
      
      const response = await axios.post('http://localhost:3001/api/album/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        }
      });
      
      // Criar entradas no banco para cada imagem
      const uploadedFiles = response.data.files;
      const photosToCreate = uploadedFiles.map(file => ({
        gallery: activeGallery,
        image: file.path,
        title: file.originalname.split('.')[0], // Usar nome do arquivo como título
        active: true
      }));
      
      await axios.post('http://localhost:3001/api/album/batch', {
        photos: photosToCreate
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setSuccess(`${uploadedFiles.length} fotos adicionadas com sucesso!`);
      
      // Buscar fotos novamente após upload múltiplo
      setDataFetched(false);
      await fetchPhotos();
      
      // Limpar previews e arquivos
      setUploadFiles([]);
      setUploadPreviews([]);
    } catch (error) {
      console.error('Erro ao fazer upload múltiplo:', error);
      setError('Erro ao fazer upload das imagens. Tente novamente mais tarde.');
    } finally {
      setIsUploading(false);
    }
  };
  
  const galleryNames = {
    preWedding: 'Pré-Wedding',
    momentos: 'Momentos Especiais',
    padrinhos: 'Padrinhos',
    festa: 'Festa'
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
            <NavLink to="/admin/album" className="active">Álbum</NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/admin/rsvp">RSVPs</NavLink>
          </NavItem>
        </NavMenu>
      </Sidebar>
      
      <Content>
        <Header>
          <PageTitle>Gerenciar Álbum</PageTitle>
          <div>
            <ActionButton onClick={() => handleOpenModal('add')}>Adicionar Foto</ActionButton>
            <SecondaryButton onClick={handleLogout} style={{ marginLeft: '1rem' }}>Sair</SecondaryButton>
          </div>
        </Header>
        
        {success && <SuccessMessage>{success}</SuccessMessage>}
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <TabsContainer>
          <Tab 
            active={activeGallery === 'preWedding'} 
            onClick={() => handleGalleryChange('preWedding')}
          >
            Pré-Wedding
          </Tab>
          <Tab 
            active={activeGallery === 'momentos'} 
            onClick={() => handleGalleryChange('momentos')}
          >
            Momentos Especiais
          </Tab>
          <Tab 
            active={activeGallery === 'padrinhos'} 
            onClick={() => handleGalleryChange('padrinhos')}
          >
            Padrinhos
          </Tab>
          <Tab 
            active={activeGallery === 'festa'} 
            onClick={() => handleGalleryChange('festa')}
          >
            Festa
          </Tab>
        </TabsContainer>
        
        {/* Área de upload múltiplo */}
        <DropZone
          isDragActive={isDragActive}
          onClick={handleMultipleFileSelect}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <p>
            <strong>Arraste e solte</strong> imagens aqui ou <strong>clique</strong> para selecionar
          </p>
          <p>Suporta JPG, PNG, GIF e WebP até 5MB</p>
          
          <input
            type="file"
            ref={multipleFileInputRef}
            style={{ display: 'none' }}
            accept="image/*"
            multiple
            onChange={handleMultipleFileChange}
          />
          
          {uploadPreviews.length > 0 && (
            <>
              <PreviewGrid>
                {uploadPreviews.map((item, index) => (
                  <PreviewItem key={index}>
                    <img src={item.preview} alt={item.name} />
                    <button onClick={() => removePreview(index)}>&times;</button>
                  </PreviewItem>
                ))}
              </PreviewGrid>
              
              {isUploading && (
                <ProgressBar progress={uploadProgress}>
                  <div />
                </ProgressBar>
              )}
              
              <UploadButton 
                onClick={handleMultipleUpload}
                disabled={isUploading}
              >
                {isUploading ? `Enviando... ${uploadProgress}%` : `Enviar ${uploadPreviews.length} fotos`}
              </UploadButton>
            </>
          )}
        </DropZone>
        
        {/* Botão para salvar reordenação */}
        {photos[activeGallery] && photos[activeGallery].length > 1 && (
          <div style={{ marginBottom: '2rem' }}>
            <ActionButton onClick={handleReorder}>
              Salvar Ordem das Fotos
            </ActionButton>
            <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: 'var(--text)' }}>
              Arraste as fotos para reordenar e clique no botão acima para salvar a nova ordem.
            </p>
          </div>
        )}
        
        {/* Grid de fotos com DnD */}
        <DndProvider backend={HTML5Backend}>
          <PhotoGrid>
            {isLoading ? (
              <EmptyState>
                <h3>Carregando...</h3>
                <p>Aguarde enquanto carregamos as fotos.</p>
              </EmptyState>
            ) : photos[activeGallery] && photos[activeGallery].length > 0 ? (
              photos[activeGallery].map((photo, index) => (
                <DraggablePhotoCard
                  key={photo.id}
                  photo={photo}
                  index={index}
                  movePhoto={movePhoto}
                  handleOpenModal={handleOpenModal}
                  handleDelete={handleDelete}
                  handleToggleActive={handleToggleActive}
                />
              ))
            ) : (
              <EmptyState>
                <h3>Nenhuma foto cadastrada</h3>
                <p>Adicione fotos para a galeria {galleryNames[activeGallery]}.</p>
                <ActionButton onClick={() => handleOpenModal('add')}>Adicionar Foto</ActionButton>
              </EmptyState>
            )}
          </PhotoGrid>
        </DndProvider>
        
        {/* Modal de edição/adição */}
        <Modal show={showModal} onClick={handleCloseModal}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>{modalMode === 'add' ? 'Adicionar Foto' : 'Editar Foto'}</ModalTitle>
              <CloseButton onClick={handleCloseModal}>&times;</CloseButton>
            </ModalHeader>
            
            {success && <SuccessMessage>{success}</SuccessMessage>}
            {error && <ErrorMessage>{error}</ErrorMessage>}
            
            <form onSubmit={handleSubmit}>
              <FormGroup>
                <Label htmlFor="gallery">Galeria</Label>
                <Select
                  id="gallery"
                  name="gallery"
                  value={currentPhoto.gallery}
                  onChange={handleChange}
                >
                  <option value="preWedding">Pré-Wedding</option>
                  <option value="momentos">Momentos Especiais</option>
                  <option value="padrinhos">Padrinhos</option>
                  <option value="festa">Festa</option>
                </Select>
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  name="title"
                  value={currentPhoto.title}
                  onChange={handleChange}
                  placeholder="Título da foto (opcional)"
                />
              </FormGroup>
              
              <FormGroup>
                <Label>Imagem *</Label>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  <div 
                    style={{ 
                      marginTop: '1rem',
                      width: '100%',
                      maxWidth: '300px',
                      height: '200px',
                      border: '1px dashed rgba(182, 149, 192, 0.3)',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden',
                      backgroundColor: '#f0f0f0',
                      cursor: 'pointer'
                    }}
                    onClick={handleImageClick}
                  >
                    {imagePreview ? (
                      <SafeImage 
                        src={imagePreview} 
                        alt="Preview" 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <span>Clique para selecionar uma imagem</span>
                    )}
                  </div>
                </div>
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="active">Status</Label>
                <Select
                  id="active"
                  name="active"
                  value={currentPhoto.active.toString()}
                  onChange={(e) => setCurrentPhoto({
                    ...currentPhoto,
                    active: e.target.value === 'true'
                  })}
                >
                  <option value="true">Ativo</option>
                  <option value="false">Inativo</option>
                </Select>
              </FormGroup>
              
              <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
                <SecondaryButton 
                  type="button" 
                  onClick={handleCloseModal}
                  style={{ marginRight: '1rem' }}
                >
                  Cancelar
                </SecondaryButton>
                <ActionButton 
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? 'Salvando...' : 'Salvar'}
                </ActionButton>
              </div>
            </form>
          </ModalContent>
        </Modal>
      </Content>
    </AdminContainer>
  );
};

export default Album;
