// Arquivo de configuração da API
// Centraliza a URL do backend para todas as requisições

const API_URL = import.meta.env.VITE_BACKEND_URL || '';

// Verificação de segurança para evitar fallback para localhost em produção
if (!API_URL) {
  console.error('VITE_BACKEND_URL não está definida no arquivo .env');
}

export default API_URL;
