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
  object-fit: cover;
  background-color: #f0f0f0;
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
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
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
            <ModalContent>
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
