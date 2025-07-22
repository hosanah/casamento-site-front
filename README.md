# Site de Casamento - Marília & Iago

Este repositório contém apenas o frontend do site de casamento de Marília e Iago, desenvolvido em React.

## Tecnologias Utilizadas

### Frontend
- React 18
- Vite
- React Router
- Styled Components

## Estrutura do Projeto

```
casamento-site-front/
├── client/              # Aplicação React
├── Dockerfile
└── README.md
```

## Requisitos

- Node.js 18 ou superior
- npm 9 ou superior

## Instalação e Configuração

### 1. Clone o repositório e instale as dependências

```bash
git clone [URL_DO_REPOSITORIO]
cd casamento-site-front
cd client
npm install
```

### 2. Configure o Frontend

```bash
cd client

# Crie um arquivo .env com a seguinte variável
VITE_BACKEND_URL="http://localhost:3001"
```

## Executando o Projeto Localmente

```bash
cd client
npm run dev
```

O site estará disponível em `http://localhost:5173`.

## Deploy do Projeto

### Deploy do Frontend (Vercel)

1. Crie uma conta no [Vercel](https://vercel.com/)
2. Clique em "New Project"
3. Importe seu repositório GitHub
4. Configure o projeto:
   - Framework Preset: Vite
   - Diretório raiz: `client`
   - Comando de build: `npm run build`
   - Diretório de saída: `dist`
   - Adicione as variáveis de ambiente:
     - `VITE_BACKEND_URL` (URL do backend)
5. Clique em "Deploy"

### Deploy do Frontend (Netlify)

1. Crie uma conta no [Netlify](https://netlify.com/)
2. Clique em "New site from Git"
3. Conecte seu repositório GitHub
4. Configure o deploy:
   - Diretório base: `client`
   - Comando de build: `npm run build`
   - Diretório de publicação: `dist`
   - Adicione as variáveis de ambiente:
     - `VITE_BACKEND_URL` (URL do backend)
5. Clique em "Deploy site"

## Acessando o Painel Administrativo

Após o deploy, acesse o painel administrativo em `/admin` com as seguintes credenciais:

- Email: `admin@casamento.com`
- Senha: `admin123`

## Funcionalidades

### Páginas Públicas
- Home com contagem regressiva
- Nossa História
- Lista de Presentes (online, física e PIX)
- Confirme sua Presença (RSVP)
- Informações (cerimônia, recepção, etc.)
- Álbum de fotos

### Painel Administrativo
- Dashboard com estatísticas
- Gerenciamento de presentes
- Configurações (PIX e Mercado Pago)
- Edição de conteúdo
- Gerenciamento de álbum
- Visualização de RSVPs

## Personalização

### Alterando a Paleta de Cores

A paleta de cores atual é:
- Lilás: #B695C0
- Verde escuro: #425943
- Roxo escuro: #503459
- Branco: #FFFFFF

Para alterar a paleta, edite o arquivo `client/src/styles/GlobalStyles.jsx` e atualize as variáveis CSS no seletor `:root`.

### Alterando Textos e Conteúdo

Os textos e conteúdos podem ser editados através do painel administrativo após o login.

## Suporte

Para suporte ou dúvidas, entre em contato através do email: [seu-email@exemplo.com]
