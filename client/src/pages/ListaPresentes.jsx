import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import API_URL from '../config/api';
import { useCart } from '../contexts/CartContext';

const PageContainer = styled.div`
  width: 100%;
`;

const PageContent = styled.div`
  width: 100%;
  max-width: var(--container-width);
  margin: 0 auto;
  padding: 60px var(--container-padding);
  
  @media (max-width: 768px) {
    padding: 40px var(--container-padding);
  }
`;

const SectionTitle = styled.h2`
  text-align: center;
  margin-bottom: 50px;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -15px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 1px;
    background-color: var(--primary);
  }
`;

const GiftTabs = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 40px;
  border-bottom: 1px solid var(--border-color);
  width: 100%;
  
  @media (max-width: 576px) {
    flex-direction: column;
    align-items: center;
  }
`;

const GiftTab = styled.div`
  padding: 15px 30px;
  margin: 0 5px;
  cursor: pointer;
  border-bottom: 2px solid ${props => props.active ? 'var(--primary)' : 'transparent'};
  font-family: var(--font-serif);
  font-size: 1.2rem;
  transition: var(--transition);
  color: ${props => props.active ? 'var(--primary)' : 'var(--accent)'};
  
  &:hover {
    color: var(--primary);
  }
  
  @media (max-width: 576px) {
    width: 100%;
    text-align: center;
    margin: 5px 0;
  }
`;

const GiftGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
  width: 100%;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
  
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

const GiftCard = styled.div`
  background-color: var(--white);
  border-radius: 5px;
  overflow: hidden;
  box-shadow: var(--shadow-md);
  transition: var(--transition);
  position: relative;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-lg);
  }
`;

const InCartBadge = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: var(--primary);
  color: white;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 0.8rem;
  z-index: 2;
`;

const GiftImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: contain;
  background-color: #f0f0f0;
  padding: 10px;
`;


const GiftImageFallback = styled.div`
  width: 100%;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f0f0f0;
  color: #999;
  font-size: 0.9rem;
`;

const GiftInfo = styled.div`
  padding: 25px;
`;

const GiftName = styled.h3`
  font-family: var(--font-serif);
  font-size: 1.3rem;
  margin-bottom: 10px;
`;

const GiftPrice = styled.div`
  color: var(--accent);
  font-weight: 500;
  margin-bottom: 20px;
`;

const GiftButton = styled.button`
  width: 100%;
  text-align: center;
  background-color: ${props => props.inCart ? 'var(--accent)' : 'var(--primary)'};
  color: var(--white);
  border: none;
  padding: 12px 20px;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: var(--transition);
  
  &:hover {
    background-color: ${props => props.inCart ? '#a06db0' : 'var(--accent)'};
  }
  
  &:disabled {
    background-color: rgba(182, 149, 192, 0.5);
    cursor: not-allowed;
  }
`;

const PixContainer = styled.div`
  background-color: var(--white);
  border-radius: 5px;
  padding: 40px;
  box-shadow: var(--shadow-md);
  text-align: center;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    padding: 30px 20px;
  }
`;

const PixQRCode = styled.div`
  width: 250px;
  height: 250px;
  margin: 30px auto;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  color: #666;
  
  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
  
  @media (max-width: 576px) {
    width: 200px;
    height: 200px;
  }
`;

const PixQRCodeFallback = styled.div`
  width: 250px;
  height: 250px;
  margin: 30px auto;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f0f0f0;
  color: #666;
  font-size: 0.9rem;
  border-radius: 5px;
  
  @media (max-width: 576px) {
    width: 200px;
    height: 200px;
  }
`;

const PixKey = styled.div`
  background-color: rgba(182, 149, 192, 0.1);
  padding: 15px;
  border-radius: 5px;
  margin: 20px 0;
  font-family: monospace;
  font-size: 1.1rem;
  word-break: break-all;
`;

// Novo componente para o botão do WhatsApp
const WhatsAppButton = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: #25D366;
  color: white;
  padding: 12px 20px;
  border-radius: 30px;
  font-size: 1rem;
  font-weight: 600;
  text-decoration: none;
  margin-top: 20px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(37, 211, 102, 0.3);
  
  &:hover {
    background-color: #128C7E;
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(37, 211, 102, 0.4);
  }
  
  svg {
    margin-right: 10px;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
  width: 100%;
  font-size: 1.2rem;
  color: var(--accent);
`;

const ErrorContainer = styled.div`
  background-color: var(--error);
  color: var(--error-text);
  padding: 20px;
  border-radius: 5px;
  text-align: center;
  margin: 20px auto;
  max-width: 800px;
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: var(--white);
  border-radius: 5px;
  padding: 30px;
  width: 90%;
  max-width: 500px;
  box-shadow: var(--shadow-lg);
  max-height: 90vh;
  overflow-y: auto;
  
  h3 {
    margin-bottom: 20px;
    color: var(--primary);
    text-align: center;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
  
  label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
  }
  
  input {
    width: 100%;
    padding: 12px;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    font-size: 1rem;
    
    &:focus {
      outline: none;
      border-color: var(--primary);
    }
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
  
  button {
    padding: 12px 20px;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;
    transition: var(--transition);
    
    &:first-child {
      background-color: transparent;
      border: 1px solid var(--border-color);
      color: var(--text);
      
      &:hover {
        background-color: #f0f0f0;
      }
    }
    
    &:last-child {
      background-color: var(--primary);
      border: none;
      color: var(--white);
      
      &:hover {
        background-color: var(--accent);
      }
      
      &:disabled {
        background-color: rgba(182, 149, 192, 0.5);
        cursor: not-allowed;
      }
    }
  }
`;

// Componentes para o carrinho
const CartButton = styled.button`
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: var(--primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-lg);
  border: none;
  cursor: pointer;
  z-index: 100;
  transition: var(--transition);
  
  &:hover {
    background-color: var(--accent);
    transform: scale(1.05);
  }
  
  @media (max-width: 768px) {
    bottom: 20px;
    right: 20px;
    width: 50px;
    height: 50px;
  }
`;

const CartCount = styled.div`
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: var(--accent);
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: bold;
`;

const CartIcon = styled.div`
  font-size: 1.5rem;
`;

const CartItemList = styled.div`
  margin: 20px 0;
  max-height: 300px;
  overflow-y: auto;
`;

const CartItem = styled.div`
  display: flex;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid var(--border-color);
  
  &:last-child {
    border-bottom: none;
  }
`;

const CartItemImage = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 5px;
  overflow: hidden;
  margin-right: 15px;
  background-color: #f0f0f0;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    padding: 2px;
  }
`;


const CartItemInfo = styled.div`
  flex: 1;
`;

const CartItemName = styled.div`
  font-weight: 500;
  margin-bottom: 5px;
`;

const CartItemPrice = styled.div`
  color: var(--accent);
  font-size: 0.9rem;
`;

const CartItemRemove = styled.button`
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  font-size: 1.2rem;
  padding: 5px;
  
  &:hover {
    color: var(--error);
  }
`;

const CartSummary = styled.div`
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid var(--border-color);
`;

const CartTotal = styled.div`
  display: flex;
  justify-content: space-between;
  font-weight: bold;
  font-size: 1.2rem;
  margin-bottom: 20px;
`;

const EmptyCartMessage = styled.div`
  text-align: center;
  padding: 30px;
  color: #999;
  position: relative; // Needed for absolute positioning of CloseButton
`;

// Add this styled component definition
const CloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  font-size: 1.8rem;
  color: #aaa;
  cursor: pointer;
  padding: 0;
  line-height: 1;

  &:hover {
    color: #333;
  }
`;

const ListaPresentes = () => {
  // Usar o hook do carrinho com fallback seguro
  const { 
    cartItems = [], 
    addToCart = () => {}, 
    removeFromCart = () => {}, 
    clearCart = () => {}, 
    getCartTotal = () => 0, 
    getCartCount = () => 0 
  } = useCart() || {};
  
  const [activeTab, setActiveTab] = useState('online');
  const [gifts, setGifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pixInfo, setPixInfo] = useState({
    key: 'exemplo.pix@casamento.com',
    description: 'Presente de Casamento',
    qrCodeImage: ''
  });
  
  // Estados para o modal de checkout
  const [showModal, setShowModal] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);
  const [selectedGift, setSelectedGift] = useState(null);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [processingPayment, setProcessingPayment] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');
  
  // Usando useCallback para evitar recriação das funções a cada render
  const fetchPresentes = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/presentes`);
      setGifts(response.data);
      setError('');
    } catch (error) {
      console.error('Erro ao buscar presentes:', error);
      setError('Não foi possível carregar a lista de presentes. Por favor, tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  }, []);
  
  const fetchPixInfo = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/api/config`);
      if (response.data) {
        setPixInfo({
          key: response.data.pixKey || 'exemplo.pix@casamento.com',
          description: response.data.pixDescription || 'Presente de Casamento',
          qrCodeImage: response.data.pixQrCodeImage || ''
        });
      }
    } catch (error) {
      console.error('Erro ao buscar informações do PIX:', error);
      // Mantém as informações padrão do PIX em caso de erro
    }
  }, []);
  
  // useEffect com dependências explícitas
  useEffect(() => {
    // Usando uma flag para garantir que as chamadas só aconteçam uma vez
    let isMounted = true;
    
    const loadData = async () => {
      if (isMounted) {
        await fetchPresentes();
        await fetchPixInfo();
      }
    };
    
    loadData();
    
    // Cleanup function para evitar memory leaks
    return () => {
      isMounted = false;
    };
  }, [fetchPresentes, fetchPixInfo]);
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };
  
  const handlePresentear = (gift) => {
    setSelectedGift(gift);
    setShowModal(true);
    setCheckoutError('');
  };
  
  const handleAddToCart = (gift) => {
    addToCart(gift);
  };
  
  const closeModal = () => {
    setShowModal(false);
    setSelectedGift(null);
    setCustomerName('');
    setCustomerEmail('');
    setCheckoutError('');
  };
  
  const openCartModal = () => {
    setShowCartModal(true);
    setCheckoutError('');
  };
  
  const closeCartModal = () => {
    setShowCartModal(false);
    setCustomerName('');
    setCustomerEmail('');
    setCheckoutError('');
  };
  
  const handleCheckout = async () => {
    if (!customerName) {
      setCheckoutError('Por favor, informe seu nome.');
      return;
    }
    
    if (customerEmail && !/\S+@\S+\.\S+/.test(customerEmail)) {
      setCheckoutError('Por favor, informe um e-mail válido.');
      return;
    }
    
    try {
      setProcessingPayment(true);
      setCheckoutError('');
      
      // Criar preferência de pagamento no Mercado Pago para um único presente
      const response = await axios.post(`${API_URL}/api/mercadopago/create-preference`, {
        presentId: selectedGift.id,
        customerName,
        customerEmail
      });
      
      // Redirecionar para a página de checkout do Mercado Pago
      if (response.data && response.data.init_point) {
        window.location.href = response.data.init_point;
      } else {
        throw new Error('Não foi possível iniciar o checkout.');
      }
    } catch (error) {
      console.error('Erro ao processar pagamento:', error);
      setCheckoutError('Ocorreu um erro ao processar o pagamento. Por favor, tente novamente.');
      setProcessingPayment(false);
    }
  };
  
  const handleCartCheckout = async () => {
    if (!customerName) {
      setCheckoutError('Por favor, informe seu nome.');
      return;
    }
    
    if (customerEmail && !/\S+@\S+\.\S+/.test(customerEmail)) {
      setCheckoutError('Por favor, informe um e-mail válido.');
      return;
    }
    
    try {
      setProcessingPayment(true);
      setCheckoutError('');
      
      // Criar preferência de pagamento no Mercado Pago para múltiplos presentes
      const response = await axios.post(`${API_URL}/api/mercadopago/create-cart-preference`, {
        items: cartItems.map(item => ({
          presentId: item.id,
          quantity: item.quantity
        })),
        customerName,
        customerEmail
      });
      
      // Redirecionar para a página de checkout do Mercado Pago
      if (response.data && response.data.init_point) {
        clearCart(); // Limpar o carrinho após iniciar o checkout
        window.location.href = response.data.init_point;
      } else {
        throw new Error('Não foi possível iniciar o checkout.');
      }
    } catch (error) {
      console.error('Erro ao processar pagamento do carrinho:', error);
      setCheckoutError('Ocorreu um erro ao processar o pagamento. Por favor, tente novamente.');
      setProcessingPayment(false);
    }
  };
  
  // Componente de imagem com tratamento de erro melhorado
  const GiftImageWithFallback = ({ src, alt }) => {
    const [hasError, setHasError] = useState(false);
    
    // Se já sabemos que a imagem não existe, renderizamos o fallback diretamente
    if (!src || hasError) {
      return <GiftImageFallback>{alt || 'Imagem não disponível'}</GiftImageFallback>;
    }
    
    return (
      <GiftImage 
        src={src.startsWith('http') ? src : `${API_URL}${src}`}
        alt={alt}
        onError={() => {
          // Em vez de tentar carregar outra imagem, apenas marcamos que houve erro
          setHasError(true);
        }}
      />
    );
  };
  
  // Componente para QR Code com tratamento de erro
  const QRCodeWithFallback = ({ src, alt }) => {
    const [hasError, setHasError] = useState(false);
    
    if (!src || hasError) {
      return <PixQRCodeFallback>QR Code não disponível</PixQRCodeFallback>;
    }
    
    return (
      <PixQRCode>
        <img 
          src={src.startsWith('http') ? src : `${API_URL}${src}`} 
          alt={alt || 'QR Code PIX'} 
          onError={() => setHasError(true)}
        />
      </PixQRCode>
    );
  };
  
  // Componente para o ícone do WhatsApp
  const WhatsAppIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white">
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
    </svg>
  );
  
  // URL para o WhatsApp com a mensagem personalizada
  const whatsappUrl = `https://wa.me/558198129255?text=${encodeURIComponent('Olá! Vim do site para compartilhar meu presente com você <3')}`;
  
  if (loading) {
    return (
      <PageContainer>
        <PageContent>
          <SectionTitle>Lista de Presentes</SectionTitle>
          <LoadingContainer>Carregando presentes...</LoadingContainer>
        </PageContent>
      </PageContainer>
    );
  }
  
  if (error) {
    return (
      <PageContainer>
        <PageContent>
          <SectionTitle>Lista de Presentes</SectionTitle>
          <ErrorContainer>{error}</ErrorContainer>
        </PageContent>
      </PageContainer>
    );
  }
  
  return (
    <PageContainer>
      <PageContent>
        <SectionTitle>Lista de Presentes</SectionTitle>
        
        <GiftTabs>
          <GiftTab 
            active={activeTab === 'online'} 
            onClick={() => setActiveTab('online')}
          >
            Lista Online
          </GiftTab>
          <GiftTab 
            active={activeTab === 'pix'} 
            onClick={() => setActiveTab('pix')}
          >
            PIX
          </GiftTab>
        </GiftTabs>
        
        {activeTab === 'online' ? (
          <>
            <GiftGrid>
              {gifts.filter(gift => gift.stock > 0).map(gift => {
                const isInCart = cartItems.some(item => item.id === gift.id);
                
                return (
                  <GiftCard key={gift.id}>
                    {isInCart && <InCartBadge>No Carrinho</InCartBadge>}
                    <GiftImageWithFallback 
                      src={gift.image || ''} 
                      alt={gift.name}
                    />
                    <GiftInfo>
                      <GiftName>{gift.name}</GiftName>
                      <GiftPrice>{formatPrice(gift.price)}</GiftPrice>
                      {gift.stock > 0 ? (
                        isInCart ? (
                          <GiftButton 
                            onClick={() => removeFromCart(gift.id)}
                            inCart
                          >
                            Remover do Carrinho
                          </GiftButton>
                        ) : (
                          <GiftButton onClick={() => handleAddToCart(gift)}>
                            Adicionar ao Carrinho
                          </GiftButton>
                        )
                      ) : (
                        <GiftButton disabled>
                          Esgotado
                        </GiftButton>
                      )}
                    </GiftInfo>
                  </GiftCard>
                );
              })}
            </GiftGrid>
            
            {/* Botão flutuante do carrinho */}
            {getCartCount() > 0 && (
              <CartButton onClick={openCartModal}>
                <CartIcon>🛒</CartIcon>
                <CartCount>{getCartCount()}</CartCount>
              </CartButton>
            )}
          </>
        ) : (
          <PixContainer>
            <h3>Contribua com o valor que desejar</h3>
            <p>Você pode nos ajudar com qualquer valor através do PIX abaixo:</p>
            
            <QRCodeWithFallback src={pixInfo.qrCodeImage} alt="QR Code PIX" />
            
            <p>Ou copie a chave PIX:</p>
            <PixKey>{pixInfo.key}</PixKey>
            
            <p>{pixInfo.description}</p>
            
            <p>Agradecemos muito pela sua contribuição!</p>
            
            {/* Botão do WhatsApp */}
            <WhatsAppButton href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon />
              Avisar sobre o presente
            </WhatsAppButton>
          </PixContainer>
        )}
        
        {/* Modal de checkout para um único presente */}
        {showModal && selectedGift && (
          <Modal>
            <ModalContent>
              <h3>Finalizar Compra</h3>
              
              <p>Você está presenteando: <strong>{selectedGift.name}</strong></p>
              <p>Valor: <strong>{formatPrice(selectedGift.price)}</strong></p>
              
              <FormGroup>
                <label htmlFor="customerName">Seu Nome *</label>
                <input
                  type="text"
                  id="customerName"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Digite seu nome completo"
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <label htmlFor="customerEmail">Seu E-mail (opcional)</label>
                <input
                  type="email"
                  id="customerEmail"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="Digite seu e-mail"
                />
              </FormGroup>
              
              {checkoutError && <ErrorContainer>{checkoutError}</ErrorContainer>}
              
              <ButtonGroup>
                <button type="button" onClick={closeModal}>Cancelar</button>
                <button 
                  type="button" 
                  onClick={handleCheckout}
                  disabled={processingPayment}
                >
                  {processingPayment ? 'Processando...' : 'Pagar com Mercado Pago'}
                </button>
              </ButtonGroup>
            </ModalContent>
          </Modal>
        )}
        
        {/* Modal do carrinho */}
        {showCartModal && (
          <Modal>
            {/* Make ModalContent relatively positioned to anchor the CloseButton */}
            <ModalContent style={{ position: 'relative' }}>
              {/* Add the CloseButton here, it will be positioned top-right */}
              <CloseButton onClick={closeCartModal}>&times;</CloseButton>
              
              <h3>Seu Carrinho</h3>
              
              {cartItems.length > 0 ? (
                <>
                  <CartItemList>
                    {cartItems.map((item) => (
                      <CartItem key={item.id}>
                        <CartItemImage>
                          <GiftImageWithFallback 
                            src={item.image || ''} 
                            alt={item.name}
                          />
                        </CartItemImage>
                        <CartItemInfo>
                          <CartItemName>{item.name}</CartItemName>
                          <CartItemPrice>{formatPrice(item.price)}</CartItemPrice>
                        </CartItemInfo>
                        <CartItemRemove onClick={() => removeFromCart(item.id)}>
                          ×
                        </CartItemRemove>
                      </CartItem>
                    ))}
                  </CartItemList>
                  
                  <CartSummary>
                    <CartTotal>
                      <span>Total:</span>
                      <span>{formatPrice(getCartTotal())}</span>
                    </CartTotal>
                    
                    <FormGroup>
                      <label htmlFor="cartCustomerName">Seu Nome</label>
                      <input 
                        type="text" 
                        id="cartCustomerName" 
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Digite seu nome completo"
                      />
                    </FormGroup>
                    
                    <FormGroup>
                      <label htmlFor="cartCustomerEmail">Seu E-mail (opcional)</label>
                      <input 
                        type="email" 
                        id="cartCustomerEmail" 
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        placeholder="Digite seu e-mail"
                      />
                    </FormGroup>
                    
                    {checkoutError && (
                      <ErrorContainer>{checkoutError}</ErrorContainer>
                    )}
                  </CartSummary>
                  
                  <ButtonGroup>
                    <button onClick={closeCartModal}>Continuar Comprando</button>
                    <button 
                      onClick={handleCartCheckout}
                      disabled={processingPayment}
                    >
                      {processingPayment ? 'Processando...' : 'Finalizar Compra'}
                    </button>
                  </ButtonGroup>
                </>
              ) : (
                <EmptyCartMessage>
                  Seu carrinho está vazio.
                </EmptyCartMessage>
              )}
            </ModalContent>
          </Modal>
        )}
      </PageContent>
    </PageContainer>
  );
};

export default ListaPresentes;
