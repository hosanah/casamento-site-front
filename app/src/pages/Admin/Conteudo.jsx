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

const Conteudo = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [content, setContent] = useState('');
  const [infoFields, setInfoFields] = useState({
    cerimonia: '',
    recepcao: '',
    dressCode: '',
    hospedagem: '',
    transporte: ''
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
      const response = await axios.get(`http://localhost:3001/api/content/${section}`);
      
      if (response.data && response.data.content) {
        if (section === 'informacoes') {
          try {
            // Tentar fazer parse do JSON para os campos separados
            const parsedContent = JSON.parse(response.data.content);
            setInfoFields({
              cerimonia: parsedContent.cerimonia || '',
              recepcao: parsedContent.recepcao || '',
              dressCode: parsedContent.dressCode || '',
              hospedagem: parsedContent.hospedagem || '',
              transporte: parsedContent.transporte || ''
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
              recepcao: extractSection('📍 Recepção', 'Recepção'),
              dressCode: extractSection('👗 Dress Code', 'Dress Code'),
              hospedagem: extractSection('🏨 Hospedagem', 'Hospedagem'),
              transporte: extractSection('🚖 Transporte', 'Transporte')
            });
          }
        } else {
          setContent(response.data.content);
        }
      } else {
        if (section === 'informacoes') {
          setInfoFields({
            cerimonia: '',
            recepcao: '',
            dressCode: '',
            hospedagem: '',
            transporte: ''
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
        
        await axios.put(`http://localhost:3001/api/content/${activeTab}`, {
          content: contentJson
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      } else {
        await axios.put(`http://localhost:3001/api/content/${activeTab}`, {
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
          </PreviewCard>
          <PreviewCard>
            <PreviewCardIcon>🥂</PreviewCardIcon>
            <PreviewCardTitle>Recepção</PreviewCardTitle>
            <p>{infoFields.recepcao}</p>
          </PreviewCard>
          <PreviewCard>
            <PreviewCardIcon>👔</PreviewCardIcon>
            <PreviewCardTitle>Dress Code</PreviewCardTitle>
            <p>{infoFields.dressCode}</p>
          </PreviewCard>
          <PreviewCard>
            <PreviewCardIcon>🏨</PreviewCardIcon>
            <PreviewCardTitle>Hospedagem Sugerida</PreviewCardTitle>
            <p>{infoFields.hospedagem}</p>
          </PreviewCard>
          <PreviewCard>
            <PreviewCardIcon>🚗</PreviewCardIcon>
            <PreviewCardTitle>Transporte</PreviewCardTitle>
            <p>{infoFields.transporte}</p>
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
            <TextArea
              value={infoFields.cerimonia}
              onChange={(e) => handleInfoFieldChange('cerimonia', e.target.value)}
              placeholder="Informe os detalhes da cerimônia..."
            />
          </InfoField>
          
          <InfoField>
            <InfoFieldHeader>
              <InfoFieldIcon>🥂</InfoFieldIcon>
              <InfoFieldTitle>Recepção</InfoFieldTitle>
            </InfoFieldHeader>
            <TextArea
              value={infoFields.recepcao}
              onChange={(e) => handleInfoFieldChange('recepcao', e.target.value)}
              placeholder="Informe os detalhes da recepção..."
            />
          </InfoField>
          
          <InfoField>
            <InfoFieldHeader>
              <InfoFieldIcon>👔</InfoFieldIcon>
              <InfoFieldTitle>Dress Code</InfoFieldTitle>
            </InfoFieldHeader>
            <TextArea
              value={infoFields.dressCode}
              onChange={(e) => handleInfoFieldChange('dressCode', e.target.value)}
              placeholder="Informe o dress code..."
            />
          </InfoField>
          
          <InfoField>
            <InfoFieldHeader>
              <InfoFieldIcon>🏨</InfoFieldIcon>
              <InfoFieldTitle>Hospedagem Sugerida</InfoFieldTitle>
            </InfoFieldHeader>
            <TextArea
              value={infoFields.hospedagem}
              onChange={(e) => handleInfoFieldChange('hospedagem', e.target.value)}
              placeholder="Informe as opções de hospedagem..."
            />
          </InfoField>
          
          <InfoField>
            <InfoFieldHeader>
              <InfoFieldIcon>🚗</InfoFieldIcon>
              <InfoFieldTitle>Transporte</InfoFieldTitle>
            </InfoFieldHeader>
            <TextArea
              value={infoFields.transporte}
              onChange={(e) => handleInfoFieldChange('transporte', e.target.value)}
              placeholder="Informe as opções de transporte..."
            />
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
