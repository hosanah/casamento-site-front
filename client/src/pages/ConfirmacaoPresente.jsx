import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import API_URL from '../config/api';

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

const ConfirmationCard = styled.div`
  background-color: var(--white);
  border-radius: 8px;
  box-shadow: var(--shadow-md);
  padding: 40px;
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
  
  h2 {
    color: var(--primary);
    margin-bottom: 20px;
  }
  
  p {
    margin-bottom: 15px;
    font-size: 1.1rem;
  }
  
  .icon {
    font-size: 4rem;
    margin-bottom: 20px;
    
    &.success {
      color: #2ecc71;
    }
    
    &.pending {
      color: #f39c12;
    }
    
    &.failure {
      color: #e74c3c;
    }
  }
  
  @media (max-width: 768px) {
    padding: 30px 20px;
  }
`;

const Button = styled.button`
  background-color: var(--primary);
  color: var(--white);
  border: none;
  border-radius: 4px;
  padding: 12px 25px;
  font-size: 1rem;
  cursor: pointer;
  transition: var(--transition);
  margin-top: 20px;
  
  &:hover {
    background-color: var(--accent);
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

const DebugInfo = styled.div`
  margin-top: 30px;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 5px;
  text-align: left;
  font-family: monospace;
  font-size: 0.9rem;
  
  h4 {
    margin-bottom: 10px;
    color: var(--accent);
  }
  
  p {
    margin-bottom: 5px;
    word-break: break-all;
  }
`;

const ConfirmacaoPresente = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [orderDetails, setOrderDetails] = useState(null);
  const [debugInfo, setDebugInfo] = useState({
    apiUrl: API_URL,
    orderId: null,
    requestUrl: null,
    responseStatus: null,
    responseData: null,
    errorMessage: null
  });
  
  const status = searchParams.get('status') || 'pending';
  const orderId = searchParams.get('order_id') || searchParams.get('external_reference');
  
  useEffect(() => {
    const fetchOrderDetails = async () => {
      // Atualizar informações de debug
      setDebugInfo(prev => ({
        ...prev,
        orderId,
        requestUrl: orderId ? `${API_URL}/api/mercadopago/order/${orderId}` : null
      }));
      
      if (!orderId) {
        setError('ID do pedido não encontrado na URL. Verifique os parâmetros de retorno do Mercado Pago.');
        setLoading(false);
        return;
      }
      
      try {
        console.log(`Buscando detalhes do pedido: ${API_URL}/api/mercadopago/order/${orderId}`);
        const response = await axios.get(`${API_URL}/api/mercadopago/order/${orderId}`);
        
        // Atualizar informações de debug com a resposta
        setDebugInfo(prev => ({
          ...prev,
          responseStatus: response.status,
          responseData: JSON.stringify(response.data, null, 2)
        }));
        
        setOrderDetails(response.data);
      } catch (error) {
        console.error('Erro ao buscar detalhes do pedido:', error);
        
        // Atualizar informações de debug com o erro
        setDebugInfo(prev => ({
          ...prev,
          responseStatus: error.response?.status || 'Erro de conexão',
          errorMessage: error.message,
          errorDetails: error.response?.data ? JSON.stringify(error.response.data, null, 2) : null
        }));
        
        setError('Não foi possível carregar os detalhes do pedido. Verifique se o backend está configurado corretamente.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrderDetails();
  }, [orderId]);
  
  const getStatusIcon = () => {
    switch (status) {
      case 'success':
      case 'approved':
        return <div className="icon success">✓</div>;
      case 'pending':
        return <div className="icon pending">⏳</div>;
      case 'failure':
      case 'rejected':
        return <div className="icon failure">✗</div>;
      default:
        return null;
    }
  };
  
  const getStatusTitle = () => {
    switch (status) {
      case 'success':
      case 'approved':
        return 'Pagamento Aprovado!';
      case 'pending':
        return 'Pagamento em Processamento';
      case 'failure':
      case 'rejected':
        return 'Pagamento não Aprovado';
      default:
        return 'Status do Pagamento';
    }
  };
  
  const getStatusMessage = () => {
    switch (status) {
      case 'success':
      case 'approved':
        return 'Seu pagamento foi aprovado com sucesso! Agradecemos muito pelo seu presente.';
      case 'pending':
        return 'Seu pagamento está sendo processado. Assim que for confirmado, atualizaremos o status.';
      case 'failure':
      case 'rejected':
        return 'Infelizmente seu pagamento não foi aprovado. Por favor, tente novamente com outro método de pagamento.';
      default:
        return 'Verifique o status do seu pagamento.';
    }
  };
  
  const handleBackToGifts = () => {
    navigate('/lista-de-presentes');
  };
  
  if (loading) {
    return (
      <PageContainer>
        <PageContent>
          <LoadingContainer>Carregando detalhes do pedido...</LoadingContainer>
        </PageContent>
      </PageContainer>
    );
  }
  
  return (
    <PageContainer>
      <PageContent>
        <ConfirmationCard>
          {getStatusIcon()}
          <h2>{getStatusTitle()}</h2>
          <p>{getStatusMessage()}</p>
          
          {error && <ErrorContainer>{error}</ErrorContainer>}
          
          {orderDetails && orderDetails.present && (
            <>
              <p>Presente: <strong>{orderDetails.present.name}</strong></p>
              <p>Valor: <strong>
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(orderDetails.present.price)}
              </strong></p>
            </>
          )}
          
          <Button onClick={handleBackToGifts}>Voltar para Lista de Presentes</Button>
          
          {/* Informações de debug - remover em produção */}
          <DebugInfo>
            <h4>Informações de Debug:</h4>
            <p><strong>API URL:</strong> {debugInfo.apiUrl}</p>
            <p><strong>Order ID:</strong> {debugInfo.orderId || 'Não encontrado'}</p>
            <p><strong>Request URL:</strong> {debugInfo.requestUrl || 'N/A'}</p>
            <p><strong>Response Status:</strong> {debugInfo.responseStatus || 'N/A'}</p>
            {debugInfo.errorMessage && (
              <p><strong>Error:</strong> {debugInfo.errorMessage}</p>
            )}
            {orderDetails && (
              <div>
                <p><strong>Dados do pedido:</strong></p>
                <pre style={{ overflowX: 'auto', maxWidth: '100%' }}>
                  {JSON.stringify(orderDetails, null, 2)}
                </pre>
              </div>
            )}
          </DebugInfo>
        </ConfirmationCard>
      </PageContent>
    </PageContainer>
  );
};

export default ConfirmacaoPresente;
