import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
  Select,
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

const EditorContainer = styled.div`
  background-color: var(--white);
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 2rem;
`;

const InfoFieldsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InfoField = styled.div`
  border: 1px solid rgba(182, 149, 192, 0.3);
  border-radius: 8px;
  padding: 1.5rem;
  background-color: #f9f9f9;
`;

const InfoFieldHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;

const InfoFieldIcon = styled.div`
  font-size: 1.5rem;
  margin-right: 0.5rem;
`;

const InfoFieldTitle = styled.h3`
  font-size: 1.2rem;
  color: var(--accent);
  margin: 0;
`;

const InfoFieldSection = styled.div`
  margin-bottom: 1rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const InfoFieldLabel = styled.label`
  display: block;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: var(--accent);
`;

const InfoFieldInput = styled(Input)`
  width: 100%;
  margin-bottom: 0.5rem;
`;

const InfoFieldHelp = styled.div`
  font-size: 0.85rem;
  color: #666;
  margin-top: 0.25rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 1.5rem;
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

const PreviewButton = styled(SecondaryButton)`
  margin-right: 1rem;
`;

const PreviewContainer = styled.div`
  margin-top: 2rem;
  background-color: var(--white);
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 2rem;
`;

const PreviewTitle = styled.h3`
  color: var(--accent);
  font-size: 1.2rem;
  margin-bottom: 1rem;
`;

const PreviewContent = styled.div`
  line-height: 1.8;
  
  p {
    margin-bottom: 1rem;
  }
`;

const PreviewGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
`;

const PreviewCard = styled.div`
  border: 1px solid rgba(182, 149, 192, 0.3);
  border-radius: 8px;
  padding: 1.5rem;
  text-align: center;
`;

const PreviewCardIcon = styled.div`
  font-size: 2rem;
  color: var(--accent);
  margin-bottom: 1rem;
`;

const PreviewCardTitle = styled.h4`
  font-size: 1.2rem;
  color: var(--accent);
  margin-bottom: 1rem;
`;

const PreviewCardImage = styled.div`
  margin-top: 1rem;
  
  img {
    max-width: 100%;
    height: auto;
    border-radius: 4px;
    max-height: 150px;
    object-fit: cover;
  }
`;

const PreviewCardMap = styled.div`
  margin-top: 1rem;
  border: 1px solid rgba(182, 149, 192, 0.3);
  border-radius: 4px;
  padding: 0.5rem;
  background-color: #f0f0f0;
  color: #666;
  font-size: 0.9rem;
`;

const Conteudo = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [content, setContent] = useState('');
  const [infoFields, setInfoFields] = useState({
    cerimonia: '',
    cerimonia_address: '',
    cerimonia_photo: '',
    
    recepcao: '',
    recepcao_address: '',
    recepcao_photo: '',
    
    dressCode: '',
    dressCode_photo: '',
    
    hospedagem: '',
    hospedagem_address: '',
    hospedagem_photo: '',
    
    transporte: '',
    transporte_address: '',
    transporte_photo: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  
  useEffect(() => {
    fetchContent(activeTab);
  }, [activeTab]);
  
  const fetchContent = async (section) => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_URL}/api/content/${section}`);
      
      if (response.data && response.data.content) {
        if (section === 'informacoes') {
          try {
            // Tentar fazer parse do JSON para os campos separados
            const parsedContent = JSON.parse(response.data.content);
            setInfoFields({
              cerimonia: parsedContent.cerimonia || '',
              cerimonia_address: parsedContent.cerimonia_address || '',
              cerimonia_photo: parsedContent.cerimonia_photo || '',
              
              recepcao: parsedContent.recepcao || '',
              recepcao_address: parsedContent.recepcao_address || '',
              recepcao_photo: parsedContent.recepcao_photo || '',
              
              dressCode: parsedContent.dressCode || '',
              dressCode_photo: parsedContent.dressCode_photo || '',
              
              hospedagem: parsedContent.hospedagem || '',
              hospedagem_address: parsedContent.hospedagem_address || '',
              hospedagem_photo: parsedContent.hospedagem_photo || '',
              
              transporte: parsedContent.transporte || '',
              transporte_address: parsedContent.transporte_address || '',
              transporte_photo: parsedContent.transporte_photo || ''
            });
          } catch (e) {
            // Se não for JSON, é o formato antigo (texto único)
            // Vamos tentar extrair as informações do texto único
            const contentText = response.data.content;
            
            // Extrair seções baseadas em emojis ou títulos
            const extractSection = (emoji, title) => {
              const emojiRegex = new RegExp(`${emoji}[^\\n]*\\n([\\s\\S]*?)(?=\\n\\n|$)`, 'i');
              const titleRegex = new RegExp(`${title}[^\\n]*\\n([\\s\\S]*?)(?=\\n\\n|$)`, 'i');
              
              let match = contentText.match(emojiRegex);
              if (!match) {
                match = contentText.match(titleRegex);
              }
              
              return match ? match[1].trim() : '';
            };
            
            setInfoFields({
              cerimonia: extractSection('📍 Cerimônia', 'Cerimônia'),
              cerimonia_address: '',
              cerimonia_photo: '',
              
              recepcao: extractSection('📍 Recepção', 'Recepção'),
              recepcao_address: '',
              recepcao_photo: '',
              
              dressCode: extractSection('👗 Dress Code', 'Dress Code'),
              dressCode_photo: '',
              
              hospedagem: extractSection('🏨 Hospedagem', 'Hospedagem'),
              hospedagem_address: '',
              hospedagem_photo: '',
              
              transporte: extractSection('🚖 Transporte', 'Transporte'),
              transporte_address: '',
              transporte_photo: ''
            });
          }
        } else {
          setContent(response.data.content);
        }
      } else {
        if (section === 'informacoes') {
          setInfoFields({
            cerimonia: '',
            cerimonia_address: '',
            cerimonia_photo: '',
            
            recepcao: '',
            recepcao_address: '',
            recepcao_photo: '',
            
            dressCode: '',
            dressCode_photo: '',
            
            hospedagem: '',
            hospedagem_address: '',
            hospedagem_photo: '',
            
            transporte: '',
            transporte_address: '',
            transporte_photo: ''
          });
        } else {
          setContent('');
        }
      }
    } catch (error) {
      console.error('Erro ao buscar conteúdo:', error);
      setError('Erro ao carregar conteúdo. Tente novamente mais tarde.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSuccess('');
    setError('');
    setShowPreview(false);
  };
  
  const handleContentChange = (e) => {
    setContent(e.target.value);
  };
  
  const handleInfoFieldChange = (field, value) => {
    setInfoFields(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleSave = async () => {
    try {
      setIsLoading(true);
      setSuccess('');
      setError('');
      
      const token = localStorage.getItem('token');
      
      if (activeTab === 'informacoes') {
        // Salvar os campos de informações como JSON
        const contentJson = JSON.stringify(infoFields);
        
        await axios.put(`${API_URL}/api/content/${activeTab}`, {
          content: contentJson
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      } else {
        await axios.put(`${API_URL}/api/content/${activeTab}`, {
          content
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      }
      
      setSuccess('Conteúdo salvo com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar conteúdo:', error);
      setError('Erro ao salvar conteúdo. Tente novamente mais tarde.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const togglePreview = () => {
    setShowPreview(!showPreview);
  };
  
  const formatPreview = () => {
    if (activeTab === 'informacoes') {
      return (
        <PreviewGrid>
          <PreviewCard>
            <PreviewCardIcon>🏛️</PreviewCardIcon>
            <PreviewCardTitle>Cerimônia</PreviewCardTitle>
            <p>{infoFields.cerimonia}</p>
            
            {infoFields.cerimonia_photo && (
              <PreviewCardImage>
                <img 
                  src={`/images/${infoFields.cerimonia_photo}`} 
                  alt="Cerimônia" 
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/images/placeholder.jpg';
                  }}
                />
              </PreviewCardImage>
            )}
            
            {infoFields.cerimonia_address && (
              <PreviewCardMap>
                <strong>Endereço:</strong> {infoFields.cerimonia_address}
              </PreviewCardMap>
            )}
          </PreviewCard>
          
          <PreviewCard>
            <PreviewCardIcon>🥂</PreviewCardIcon>
            <PreviewCardTitle>Recepção</PreviewCardTitle>
            <p>{infoFields.recepcao}</p>
            
            {infoFields.recepcao_photo && (
              <PreviewCardImage>
                <img 
                  src={`/images/${infoFields.recepcao_photo}`} 
                  alt="Recepção" 
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/images/placeholder.jpg';
                  }}
                />
              </PreviewCardImage>
            )}
            
            {infoFields.recepcao_address && (
              <PreviewCardMap>
                <strong>Endereço:</strong> {infoFields.recepcao_address}
              </PreviewCardMap>
            )}
          </PreviewCard>
          
          <PreviewCard>
            <PreviewCardIcon>👔</PreviewCardIcon>
            <PreviewCardTitle>Dress Code</PreviewCardTitle>
            <p>{infoFields.dressCode}</p>
            
            {infoFields.dressCode_photo && (
              <PreviewCardImage>
                <img 
                  src={`/images/${infoFields.dressCode_photo}`} 
                  alt="Dress Code" 
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/images/placeholder.jpg';
                  }}
                />
              </PreviewCardImage>
            )}
          </PreviewCard>
          
          <PreviewCard>
            <PreviewCardIcon>🏨</PreviewCardIcon>
            <PreviewCardTitle>Hospedagem Sugerida</PreviewCardTitle>
            <p>{infoFields.hospedagem}</p>
            
            {infoFields.hospedagem_photo && (
              <PreviewCardImage>
                <img 
                  src={`/images/${infoFields.hospedagem_photo}`} 
                  alt="Hospedagem" 
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/images/placeholder.jpg';
                  }}
                />
              </PreviewCardImage>
            )}
            
            {infoFields.hospedagem_address && (
              <PreviewCardMap>
                <strong>Endereço:</strong> {infoFields.hospedagem_address}
              </PreviewCardMap>
            )}
          </PreviewCard>
          
          <PreviewCard>
            <PreviewCardIcon>🚗</PreviewCardIcon>
            <PreviewCardTitle>Transporte</PreviewCardTitle>
            <p>{infoFields.transporte}</p>
            
            {infoFields.transporte_photo && (
              <PreviewCardImage>
                <img 
                  src={`/images/${infoFields.transporte_photo}`} 
                  alt="Transporte" 
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/images/placeholder.jpg';
                  }}
                />
              </PreviewCardImage>
            )}
            
            {infoFields.transporte_address && (
              <PreviewCardMap>
                <strong>Endereço:</strong> {infoFields.transporte_address}
              </PreviewCardMap>
            )}
          </PreviewCard>
        </PreviewGrid>
      );
    } else {
      return content.split('\n\n').map((paragraph, index) => (
        <p key={index}>{paragraph}</p>
      ));
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/admin/login';
  };
  
  const renderEditor = () => {
    if (activeTab === 'informacoes') {
      return (
        <InfoFieldsContainer>
          <InfoField>
            <InfoFieldHeader>
              <InfoFieldIcon>🏛️</InfoFieldIcon>
              <InfoFieldTitle>Cerimônia</InfoFieldTitle>
            </InfoFieldHeader>
            
            <InfoFieldSection>
              <InfoFieldLabel>Descrição</InfoFieldLabel>
              <TextArea
                value={infoFields.cerimonia}
                onChange={(e) => handleInfoFieldChange('cerimonia', e.target.value)}
                placeholder="Informe os detalhes da cerimônia..."
              />
            </InfoFieldSection>
            
            <InfoFieldSection>
              <InfoFieldLabel>Endereço para o Google Maps</InfoFieldLabel>
              <InfoFieldInput
                type="text"
                value={infoFields.cerimonia_address}
                onChange={(e) => handleInfoFieldChange('cerimonia_address', e.target.value)}
                placeholder="Ex: Av. Paulista, 1000, São Paulo, SP"
              />
              <InfoFieldHelp>Informe o endereço completo para exibição no Google Maps</InfoFieldHelp>
            </InfoFieldSection>
            
            <InfoFieldSection>
              <InfoFieldLabel>Foto</InfoFieldLabel>
              <InfoFieldInput
                type="text"
                value={infoFields.cerimonia_photo}
                onChange={(e) => handleInfoFieldChange('cerimonia_photo', e.target.value)}
                placeholder="Ex: cerimonia.jpg"
              />
              <InfoFieldHelp>Informe apenas o nome do arquivo. A imagem deve estar na pasta public/images</InfoFieldHelp>
            </InfoFieldSection>
          </InfoField>
          
          <InfoField>
            <InfoFieldHeader>
              <InfoFieldIcon>🥂</InfoFieldIcon>
              <InfoFieldTitle>Recepção</InfoFieldTitle>
            </InfoFieldHeader>
            
            <InfoFieldSection>
              <InfoFieldLabel>Descrição</InfoFieldLabel>
              <TextArea
                value={infoFields.recepcao}
                onChange={(e) => handleInfoFieldChange('recepcao', e.target.value)}
                placeholder="Informe os detalhes da recepção..."
              />
            </InfoFieldSection>
            
            <InfoFieldSection>
              <InfoFieldLabel>Endereço para o Google Maps</InfoFieldLabel>
              <InfoFieldInput
                type="text"
                value={infoFields.recepcao_address}
                onChange={(e) => handleInfoFieldChange('recepcao_address', e.target.value)}
                placeholder="Ex: Av. Paulista, 1000, São Paulo, SP"
              />
              <InfoFieldHelp>Informe o endereço completo para exibição no Google Maps</InfoFieldHelp>
            </InfoFieldSection>
            
            <InfoFieldSection>
              <InfoFieldLabel>Foto</InfoFieldLabel>
              <InfoFieldInput
                type="text"
                value={infoFields.recepcao_photo}
                onChange={(e) => handleInfoFieldChange('recepcao_photo', e.target.value)}
                placeholder="Ex: recepcao.jpg"
              />
              <InfoFieldHelp>Informe apenas o nome do arquivo. A imagem deve estar na pasta public/images</InfoFieldHelp>
            </InfoFieldSection>
          </InfoField>
          
          <InfoField>
            <InfoFieldHeader>
              <InfoFieldIcon>👔</InfoFieldIcon>
              <InfoFieldTitle>Dress Code</InfoFieldTitle>
            </InfoFieldHeader>
            
            <InfoFieldSection>
              <InfoFieldLabel>Descrição</InfoFieldLabel>
              <TextArea
                value={infoFields.dressCode}
                onChange={(e) => handleInfoFieldChange('dressCode', e.target.value)}
                placeholder="Informe o dress code..."
              />
            </InfoFieldSection>
            
            <InfoFieldSection>
              <InfoFieldLabel>Foto</InfoFieldLabel>
              <InfoFieldInput
                type="text"
                value={infoFields.dressCode_photo}
                onChange={(e) => handleInfoFieldChange('dressCode_photo', e.target.value)}
                placeholder="Ex: dresscode.jpg"
              />
              <InfoFieldHelp>Informe apenas o nome do arquivo. A imagem deve estar na pasta public/images</InfoFieldHelp>
            </InfoFieldSection>
          </InfoField>
          
          <InfoField>
            <InfoFieldHeader>
              <InfoFieldIcon>🏨</InfoFieldIcon>
              <InfoFieldTitle>Hospedagem Sugerida</InfoFieldTitle>
            </InfoFieldHeader>
            
            <InfoFieldSection>
              <InfoFieldLabel>Descrição</InfoFieldLabel>
              <TextArea
                value={infoFields.hospedagem}
                onChange={(e) => handleInfoFieldChange('hospedagem', e.target.value)}
                placeholder="Informe as opções de hospedagem..."
              />
            </InfoFieldSection>
            
            <InfoFieldSection>
              <InfoFieldLabel>Endereço para o Google Maps</InfoFieldLabel>
              <InfoFieldInput
                type="text"
                value={infoFields.hospedagem_address}
                onChange={(e) => handleInfoFieldChange('hospedagem_address', e.target.value)}
                placeholder="Ex: Av. Paulista, 1000, São Paulo, SP"
              />
              <InfoFieldHelp>Informe o endereço completo para exibição no Google Maps</InfoFieldHelp>
            </InfoFieldSection>
            
            <InfoFieldSection>
              <InfoFieldLabel>Foto</InfoFieldLabel>
              <InfoFieldInput
                type="text"
                value={infoFields.hospedagem_photo}
                onChange={(e) => handleInfoFieldChange('hospedagem_photo', e.target.value)}
                placeholder="Ex: hospedagem.jpg"
              />
              <InfoFieldHelp>Informe apenas o nome do arquivo. A imagem deve estar na pasta public/images</InfoFieldHelp>
            </InfoFieldSection>
          </InfoField>
          
          <InfoField>
            <InfoFieldHeader>
              <InfoFieldIcon>🚗</InfoFieldIcon>
              <InfoFieldTitle>Transporte</InfoFieldTitle>
            </InfoFieldHeader>
            
            <InfoFieldSection>
              <InfoFieldLabel>Descrição</InfoFieldLabel>
              <TextArea
                value={infoFields.transporte}
                onChange={(e) => handleInfoFieldChange('transporte', e.target.value)}
                placeholder="Informe as opções de transporte..."
              />
            </InfoFieldSection>
            
            <InfoFieldSection>
              <InfoFieldLabel>Endereço para o Google Maps</InfoFieldLabel>
              <InfoFieldInput
                type="text"
                value={infoFields.transporte_address}
                onChange={(e) => handleInfoFieldChange('transporte_address', e.target.value)}
                placeholder="Ex: Av. Paulista, 1000, São Paulo, SP"
              />
              <InfoFieldHelp>Informe o endereço completo para exibição no Google Maps</InfoFieldHelp>
            </InfoFieldSection>
            
            <InfoFieldSection>
              <InfoFieldLabel>Foto</InfoFieldLabel>
              <InfoFieldInput
                type="text"
                value={infoFields.transporte_photo}
                onChange={(e) => handleInfoFieldChange('transporte_photo', e.target.value)}
                placeholder="Ex: transporte.jpg"
              />
              <InfoFieldHelp>Informe apenas o nome do arquivo. A imagem deve estar na pasta public/images</InfoFieldHelp>
            </InfoFieldSection>
          </InfoField>
        </InfoFieldsContainer>
      );
    } else {
      return (
        <TextArea 
          value={content} 
          onChange={handleContentChange}
          placeholder="Digite o conteúdo aqui..."
          style={{ minHeight: '400px' }}
        />
      );
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
            <NavLink to="/admin/conteudo" className="active">Conteúdo</NavLink>
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
          <PageTitle>Gerenciar Conteúdo</PageTitle>
          <SecondaryButton onClick={handleLogout}>Sair</SecondaryButton>
        </Header>
        
        {success && <SuccessMessage>{success}</SuccessMessage>}
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <TabsContainer>
          <Tab 
            active={activeTab === 'home'} 
            onClick={() => handleTabChange('home')}
          >
            Home
          </Tab>
          <Tab 
            active={activeTab === 'historia'} 
            onClick={() => handleTabChange('historia')}
          >
            Nossa História
          </Tab>
          <Tab 
            active={activeTab === 'informacoes'} 
            onClick={() => handleTabChange('informacoes')}
          >
            Informações
          </Tab>
        </TabsContainer>
        
        <EditorContainer>
          {renderEditor()}
          
          <ButtonContainer>
            <PreviewButton onClick={togglePreview}>
              {showPreview ? 'Ocultar Preview' : 'Visualizar Preview'}
            </PreviewButton>
            <SubmitButton onClick={handleSave} disabled={isLoading}>
              {isLoading ? 'Salvando...' : 'Salvar Conteúdo'}
            </SubmitButton>
          </ButtonContainer>
          
          {showPreview && (
            <PreviewContainer>
              <PreviewTitle>Preview</PreviewTitle>
              <PreviewContent>
                {formatPreview()}
              </PreviewContent>
            </PreviewContainer>
          )}
        </EditorContainer>
      </Content>
    </AdminContainer>
  );
};

export default Conteudo;
