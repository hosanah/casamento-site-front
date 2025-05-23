import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import API_URL from '../../config/api';
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
  ErrorMessage
} from '../../styles/AdminStyles';
import styled from 'styled-components';
import { useConfig } from '../../contexts/ConfigContext';

const ConfigContainer = styled.div`
  background-color: var(--white);
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  margin-bottom: 2rem;
`;

const ConfigTitle = styled.h3`
  color: var(--accent);
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid rgba(182, 149, 192, 0.3);
  padding-bottom: 0.5rem;
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
    object-fit: contain;
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

const BackgroundImagesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1.5rem;
`;

const BackgroundImageItem = styled.div`
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background-color: #f0f0f0;
  aspect-ratio: 16/9;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: opacity 0.3s ease;
    opacity: ${props => props.active ? 1 : 0.5};
  }
  
  &:hover {
    .image-actions {
      opacity: 1;
    }
  }
`;

const ImageActions = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  
  button {
    margin: 0.25rem;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
    
    &.delete-btn {
      background-color: #e74c3c;
      color: white;
    }
    
    &.toggle-btn {
      background-color: ${props => props.active ? '#e67e22' : '#2ecc71'};
      color: white;
    }
  }
`;

const DragHandle = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  width: 24px;
  height: 24px;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: grab;
  
  &:active {
    cursor: grabbing;
  }
  
  &::before {
    content: "≡";
    font-size: 16px;
    color: #333;
  }
`;

const DropZone = styled.div`
  margin-top: 1rem;
  width: 100%;
  height: 200px;
  border: 2px dashed rgba(182, 149, 192, 0.5);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgba(182, 149, 192, 0.05);
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover, &.active {
    background-color: rgba(182, 149, 192, 0.1);
    border-color: rgba(182, 149, 192, 0.8);
  }
  
  p {
    margin: 0.5rem 0;
    color: var(--accent);
  }
  
  .icon {
    font-size: 2rem;
    color: var(--accent);
    margin-bottom: 0.5rem;
  }
`;

const Config = () => {
  const { config, setConfig } = useConfig();
  const [qrCodeImage, setQrCodeImage] = useState(null);
  const [qrCodePreview, setQrCodePreview] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  
  // Estado para imagens de fundo
  const [backgroundImages, setBackgroundImages] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedFiles, setDraggedFiles] = useState([]);
  
  // Referências para os inputs de arquivo
  const fileInputRef = React.createRef();
  const bgFileInputRef = React.createRef();
  
  useEffect(() => {
    fetchConfig();
    fetchBackgroundImages();
  }, []);
  
  const fetchConfig = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/config`);
      
      if (response.data) {
        setConfig({
          siteTitle: response.data.siteTitle || '',
          weddingDate: response.data.weddingDate || '',
          pixKey: response.data.pixKey || '',
          pixDescription: response.data.pixDescription || '',
          mercadoPagoPublicKey: response.data.mercadoPagoPublicKey || '',
          mercadoPagoAccessToken: response.data.mercadoPagoAccessToken || '',
          mercadoPagoWebhookUrl: response.data.mercadoPagoWebhookUrl || '',
          mercadoPagoNotificationUrl: response.data.mercadoPagoNotificationUrl || ''
        });
        
        // Verificar se há QR Code
        if (response.data.pixQrCodeImage) {
          setQrCodePreview(response.data.pixQrCodeImage);
        }
      }
    } catch (error) {
      console.error('Erro ao buscar configurações:', error);
      setError('Erro ao carregar configurações. Tente novamente mais tarde.');
    }
  };
  
  const fetchBackgroundImages = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/background-images`);
      setBackgroundImages(response.data);
    } catch (error) {
      console.error('Erro ao buscar imagens de fundo:', error);
      setError('Erro ao carregar imagens de fundo. Tente novamente mais tarde.');
    }
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setConfig({
      ...config,
      [name]: value
    });
  };
  
  const handleQrCodeClick = () => {
    fileInputRef.current.click();
  };
  
  const handleQrCodeChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Verificar tipo de arquivo
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Tipo de arquivo não suportado. Apenas imagens são permitidas.');
      return;
    }
    
    // Verificar tamanho do arquivo (2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError('Arquivo muito grande. O tamanho máximo é 2MB.');
      return;
    }
    
    setQrCodeImage(file);
    
    // Criar preview da imagem
    const reader = new FileReader();
    reader.onloadend = () => {
      setQrCodePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };
  
  const handleBackgroundImageClick = () => {
    bgFileInputRef.current.click();
  };
  
  const handleBackgroundImageChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    await uploadBackgroundImages(files);
  };
  
  const uploadBackgroundImages = async (files) => {
    setIsLoading(true);
    setSuccess('');
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      const headers = {
        Authorization: `Bearer ${token}`
      };
      
      // Upload de cada arquivo
      for (const file of files) {
        // Verificar tipo de arquivo
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
          setError(`Arquivo "${file.name}" não suportado. Apenas imagens são permitidas.`);
          continue;
        }
        
        // Verificar tamanho do arquivo (5MB)
        if (file.size > 5 * 1024 * 1024) {
          setError(`Arquivo "${file.name}" muito grande. O tamanho máximo é 5MB.`);
          continue;
        }
        
        const formData = new FormData();
        formData.append('image', file);
        
        await axios.post(`${API_URL}/api/background-images/upload`, formData, {
          headers: {
            ...headers,
            'Content-Type': 'multipart/form-data'
          }
        });
      }
      
      // Atualizar lista de imagens
      fetchBackgroundImages();
      setSuccess('Imagens de fundo enviadas com sucesso!');
    } catch (error) {
      console.error('Erro ao fazer upload das imagens de fundo:', error);
      setError('Erro ao fazer upload das imagens de fundo. Tente novamente.');
    } finally {
      setIsLoading(false);
      setDraggedFiles([]);
    }
  };
  
  const handleDeleteBackgroundImage = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const headers = {
        Authorization: `Bearer ${token}`
      };
      
      await axios.delete(`${API_URL}/api/background-images/${id}`, { headers });
      
      // Atualizar lista de imagens
      setBackgroundImages(backgroundImages.filter(img => img.id !== id));
      setSuccess('Imagem removida com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir imagem de fundo:', error);
      setError('Erro ao excluir imagem de fundo. Tente novamente.');
    }
  };
  
  const handleToggleBackgroundImage = async (id, active) => {
    try {
      const token = localStorage.getItem('token');
      const headers = {
        Authorization: `Bearer ${token}`
      };
      
      await axios.put(`${API_URL}/api/background-images/${id}`, 
        { active: !active }, 
        { headers }
      );
      
      // Atualizar lista de imagens
      setBackgroundImages(backgroundImages.map(img => 
        img.id === id ? { ...img, active: !active } : img
      ));
      
      setSuccess(`Imagem ${!active ? 'ativada' : 'desativada'} com sucesso!`);
    } catch (error) {
      console.error('Erro ao atualizar status da imagem de fundo:', error);
      setError('Erro ao atualizar status da imagem de fundo. Tente novamente.');
    }
  };
  
  const handleDragEnd = async (result) => {
    if (!result.destination) return;
    
    const items = Array.from(backgroundImages);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    // Atualizar ordem localmente
    setBackgroundImages(items);
    
    try {
      const token = localStorage.getItem('token');
      const headers = {
        Authorization: `Bearer ${token}`
      };
      
      // Enviar nova ordem para o servidor
      await axios.post(`${API_URL}/api/background-images/reorder`, 
        { order: items.map(item => item.id) }, 
        { headers }
      );
      
      setSuccess('Ordem das imagens atualizada com sucesso!');
    } catch (error) {
      console.error('Erro ao reordenar imagens de fundo:', error);
      setError('Erro ao reordenar imagens de fundo. Tente novamente.');
      // Reverter para a ordem anterior em caso de erro
      fetchBackgroundImages();
    }
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length === 0) return;
    
    setDraggedFiles(files);
    uploadBackgroundImages(files);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setIsLoading(true);
    setSuccess('');
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      const headers = {
        Authorization: `Bearer ${token}`
      };
      
      // Primeiro, fazer upload do QR Code se houver um novo
      if (qrCodeImage) {
        const formData = new FormData();
        formData.append('qrcode', qrCodeImage);
        
        try {
          const uploadResponse = await axios.post(`${API_URL}/api/config/upload-qrcode`, formData, {
            headers: {
              ...headers,
              'Content-Type': 'multipart/form-data'
            }
          });
          
          // O banco já foi atualizado automaticamente pelo backend
          // Apenas atualizamos o estado local com o novo caminho
          if (uploadResponse.data.imagePath) {
            setQrCodePreview(uploadResponse.data.imagePath);
          }
        } catch (uploadError) {
          console.error('Erro ao fazer upload da imagem:', uploadError);
          setError('Erro ao fazer upload da imagem. Tente novamente.');
          setIsLoading(false);
          return;
        }
      }
      
      // Depois, atualizar as demais configurações
      await axios.put(`${API_URL}/api/config`, config, { headers });
      
      setSuccess('Configurações salvas com sucesso!');
      
      // Recarregar as configurações para garantir dados atualizados
      fetchConfig();
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      setError('Erro ao salvar configurações. Tente novamente mais tarde.');
    } finally {
      setIsLoading(false);
      // Limpar o estado de upload de imagem
      setQrCodeImage(null);
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
            {config.siteTitle || 'Marília & Iago'}
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
            <NavLink to="/admin/config" className="active">Configurações</NavLink>
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
          <PageTitle>Configurações</PageTitle>
          <SecondaryButton onClick={handleLogout}>Sair</SecondaryButton>
        </Header>
        
        {success && <SuccessMessage>{success}</SuccessMessage>}
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <form onSubmit={handleSubmit}>
          <ConfigContainer>
            <ConfigTitle>Configurações Gerais</ConfigTitle>
            
            <FormGroup>
              <Label htmlFor="siteTitle">Título do Site</Label>
              <Input
                type="text"
                id="siteTitle"
                name="siteTitle"
                value={config.siteTitle}
                onChange={handleChange}
                placeholder="Ex: Casamento Noiva & Noivo"
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="weddingDate">Data do Casamento</Label>
              <Input
                type="date"
                id="weddingDate"
                name="weddingDate"
                value={config.weddingDate}
                onChange={handleChange}
              />
            </FormGroup>
          </ConfigContainer>
          
          <ConfigContainer>
            <ConfigTitle>Configurações de PIX</ConfigTitle>
            
            <FormGroup>
              <Label htmlFor="pixKey">Chave PIX</Label>
              <Input
                type="text"
                id="pixKey"
                name="pixKey"
                value={config.pixKey}
                onChange={handleChange}
                placeholder="Ex: email@exemplo.com, 12345678900, telefone, etc."
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="pixDescription">Descrição do PIX</Label>
              <TextArea
                id="pixDescription"
                name="pixDescription"
                value={config.pixDescription}
                onChange={handleChange}
                placeholder="Ex: Presente de casamento para Noiva e Noivo"
                rows={3}
              />
            </FormGroup>
            
            <FormGroup>
              <Label>QR Code do PIX</Label>
              <ImagePreview onClick={handleQrCodeClick}>
                {qrCodePreview ? (
                  <img 
                    src={qrCodePreview.startsWith('data:') ? qrCodePreview : `${API_URL}${qrCodePreview}`} 
                    alt="QR Code do PIX" 
                    onError={(e) => {
                      console.error('Erro ao carregar imagem:', e);
                      e.target.style.display = 'none';
                    }}
                  />
                ) : (
                  <p>Clique para adicionar QR Code</p>
                )}
              </ImagePreview>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept="image/*"
                onChange={handleQrCodeChange}
              />
              <ImageUploadButton type="button" onClick={handleQrCodeClick}>
                {qrCodePreview ? 'Alterar QR Code' : 'Adicionar QR Code'}
              </ImageUploadButton>
            </FormGroup>
          </ConfigContainer>
          
          <ConfigContainer>
            <ConfigTitle>Configurações do Mercado Pago</ConfigTitle>
            
            <FormGroup>
              <Label htmlFor="mercadoPagoPublicKey">Public Key</Label>
              <Input
                type="text"
                id="mercadoPagoPublicKey"
                name="mercadoPagoPublicKey"
                value={config.mercadoPagoPublicKey}
                onChange={handleChange}
                placeholder="APP_USR-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="mercadoPagoAccessToken">Access Token</Label>
              <Input
                type="text"
                id="mercadoPagoAccessToken"
                name="mercadoPagoAccessToken"
                value={config.mercadoPagoAccessToken}
                onChange={handleChange}
                placeholder="APP_USR-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="mercadoPagoWebhookUrl">URL de Webhook</Label>
              <Input
                type="text"
                id="mercadoPagoWebhookUrl"
                name="mercadoPagoWebhookUrl"
                value={config.mercadoPagoWebhookUrl}
                onChange={handleChange}
                placeholder="https://seu-site.com/api/mercadopago/webhook"
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="mercadoPagoNotificationUrl">URL de Notificação</Label>
              <Input
                type="text"
                id="mercadoPagoNotificationUrl"
                name="mercadoPagoNotificationUrl"
                value={config.mercadoPagoNotificationUrl}
                onChange={handleChange}
                placeholder="https://seu-site.com/api/mercadopago/notification"
              />
            </FormGroup>
          </ConfigContainer>
          
          <ConfigContainer>
            <ConfigTitle>Imagens de Fundo</ConfigTitle>
            
            <p>Adicione imagens de fundo para serem exibidas no site. As imagens serão exibidas em rotação.</p>
            
            <DropZone
              className={isDragging ? 'active' : ''}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={handleBackgroundImageClick}
            >
              <div className="icon">📁</div>
              <p>Arraste imagens aqui ou clique para selecionar</p>
              <p>Formatos aceitos: JPG, PNG, GIF, WebP</p>
            </DropZone>
            <input
              type="file"
              ref={bgFileInputRef}
              style={{ display: 'none' }}
              accept="image/*"
              multiple
              onChange={handleBackgroundImageChange}
            />
            
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="background-images" direction="horizontal">
                {(provided) => (
                  <BackgroundImagesGrid
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {backgroundImages.map((image, index) => (
                      <Draggable key={image.id} draggableId={`image-${image.id}`} index={index}>
                        {(provided) => (
                          <BackgroundImageItem
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            active={image.active}
                          >
                            <img 
                              src={`${API_URL}${image.path}`} 
                              alt={`Imagem de fundo ${index + 1}`} 
                              onError={(e) => {
                                console.error('Erro ao carregar imagem:', e);
                                e.target.style.display = 'none';
                              }}
                            />
                            <ImageActions className="image-actions" active={image.active}>
                              <button
                                type="button"
                                className="toggle-btn"
                                onClick={() => handleToggleBackgroundImage(image.id, image.active)}
                              >
                                {image.active ? 'Desativar' : 'Ativar'}
                              </button>
                              <button
                                type="button"
                                className="delete-btn"
                                onClick={() => handleDeleteBackgroundImage(image.id)}
                              >
                                Excluir
                              </button>
                            </ImageActions>
                            <DragHandle {...provided.dragHandleProps} />
                          </BackgroundImageItem>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </BackgroundImagesGrid>
                )}
              </Droppable>
            </DragDropContext>
          </ConfigContainer>
          
          <SubmitButton type="submit" disabled={isLoading}>
            {isLoading ? 'Salvando...' : 'Salvar Configurações'}
          </SubmitButton>
        </form>
      </Content>
    </AdminContainer>
  );
};

export default Config;
