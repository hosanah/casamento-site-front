import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

// Cria o contexto
const ConfigContext = createContext();

// Hook customizado para consumir o contexto
export const useConfig = () => useContext(ConfigContext);

// Componente provider do contexto
export const ConfigProvider = ({ children }) => {
  const [config, setConfig] = useState({
    siteTitle: 'Noiva & Noivo',
    weddingDate: '',
    pixKey: '',
    pixDescription: '',
    pixQrCodeImage: ''
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Busca as configurações da API
  const fetchConfig = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get('http://localhost:3001/api/config');

      if (response.data) {
        setConfig((prev) => ({
          siteTitle: response.data.siteTitle || prev.siteTitle,
          weddingDate: response.data.weddingDate || '',
          pixKey: response.data.pixKey || '',
          pixDescription: response.data.pixDescription || '',
          pixQrCodeImage: response.data.pixQrCodeImage || ''
        }));
      }
    } catch (err) {
      console.error('Erro ao buscar configurações:', err);
      setError('Não foi possível carregar as configurações do site.');
    } finally {
      setLoading(false);
    }
  };

  // Executa fetchConfig assim que o provider for montado
  useEffect(() => {
    fetchConfig();
  }, []);

  // Formata a data do casamento para exibição
  const formatWeddingDate = () => {
    if (!config.weddingDate) return '';

    try {
      const date = new Date(config.weddingDate);
      return new Intl.DateTimeFormat('pt-BR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }).format(date);
    } catch (err) {
      console.error('Erro ao formatar data:', err);
      return config.weddingDate;
    }
  };

  // Valores expostos pelo contexto
  const value = {
    config,
    setConfig, // ✅ adicionado para uso externo
    loading,
    error,
    refreshConfig: fetchConfig,
    formatWeddingDate
  };

  return (
    <ConfigContext.Provider value={value}>
      {children}
    </ConfigContext.Provider>
  );
};
