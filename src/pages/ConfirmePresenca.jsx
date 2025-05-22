import React from 'react';
import styled from 'styled-components';
import axios from 'axios';

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

const FormContainer = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  background-color: var(--white);
  padding: 50px;
  border-radius: 5px;
  box-shadow: var(--shadow-md);
  position: relative;
  
  &::before,
  &::after {
    content: '';
    position: absolute;
    width: 100px;
    height: 100px;
    background-image: url('/images/floral-corner.png');
    background-size: contain;
    background-repeat: no-repeat;
    opacity: 0.2;
  }
  
  &::before {
    top: 20px;
    left: 20px;
  }
  
  &::after {
    bottom: 20px;
    right: 20px;
    transform: rotate(180deg);
  }
  
  @media (max-width: 768px) {
    padding: 30px;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 25px;
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: 10px;
  font-family: var(--font-serif);
  font-size: 1.1rem;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 15px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-family: var(--font-sans);
  font-size: 1rem;
  transition: var(--transition);
  
  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(182, 149, 192, 0.2);
  }
`;

const FormTextarea = styled.textarea`
  width: 100%;
  padding: 15px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-family: var(--font-sans);
  font-size: 1rem;
  transition: var(--transition);
  height: 150px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(182, 149, 192, 0.2);
  }
`;

const FormButton = styled.button`
  background-color: var(--primary);
  color: var(--white);
  border: none;
  padding: 15px 30px;
  font-family: var(--font-sans);
  font-size: 1.1rem;
  cursor: pointer;
  transition: var(--transition);
  border-radius: 4px;
  width: 100%;
  
  &:hover {
    background-color: var(--accent);
  }
  
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const ThankYouMessage = styled.div`
  text-align: center;
  padding: 30px;
  
  h3 {
    font-family: var(--font-serif);
    font-size: 2rem;
    margin-bottom: 20px;
    color: var(--primary);
  }
  
  p {
    font-size: 1.2rem;
    margin-bottom: 30px;
  }
`;

const ErrorMessage = styled.div`
  background-color: var(--error);
  color: var(--error-text);
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 20px;
  text-align: center;
`;

const ConfirmePresenca = () => {
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    phone: '',
    companions: 0,
    message: ''
  });
  
  const [submitted, setSubmitted] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Integração com o backend - URL base corrigida
      await axios.post('http://localhost:3001/api/rsvp', {
        name: formData.name,
        companions: parseInt(formData.companions) || 0,
        email: formData.email,
        phone: formData.phone,
        message: formData.message
      });
      
      setSubmitted(true);
    } catch (error) {
      console.error('Erro ao enviar confirmação:', error);
      setError(
        error.response?.data?.message || 
        'Ocorreu um erro ao enviar sua confirmação. Por favor, tente novamente.'
      );
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <PageContainer>
      <PageContent>
        <SectionTitle>Confirme sua Presença</SectionTitle>
        
        <FormContainer>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          
          {submitted ? (
            <ThankYouMessage>
              <h3>Obrigado!</h3>
              <p>Sua presença foi confirmada com sucesso. Estamos ansiosos para celebrar este momento especial com você!</p>
              <FormButton onClick={() => {
                setSubmitted(false);
                setFormData({
                  name: '',
                  email: '',
                  phone: '',
                  companions: 0,
                  message: ''
                });
              }}>Enviar outra confirmação</FormButton>
            </ThankYouMessage>
          ) : (
            <form onSubmit={handleSubmit}>
              <FormGroup>
                <FormLabel htmlFor="name">Nome Completo*</FormLabel>
                <FormInput
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <FormLabel htmlFor="email">E-mail</FormLabel>
                <FormInput
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </FormGroup>
              
              <FormGroup>
                <FormLabel htmlFor="phone">Telefone</FormLabel>
                <FormInput
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </FormGroup>
              
              <FormGroup>
                <FormLabel htmlFor="companions">Número de Acompanhantes*</FormLabel>
                <FormInput
                  type="number"
                  id="companions"
                  name="companions"
                  min="0"
                  value={formData.companions}
                  onChange={handleChange}
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <FormLabel htmlFor="message">Mensagem (opcional)</FormLabel>
                <FormTextarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                />
              </FormGroup>
              
              <FormButton type="submit" disabled={loading}>
                {loading ? 'Enviando...' : 'Confirmar Presença'}
              </FormButton>
            </form>
          )}
        </FormContainer>
      </PageContent>
    </PageContainer>
  );
};

export default ConfirmePresenca;
