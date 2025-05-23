# Site de Casamento - Marília & Iago

Este é um site completo para casamento com frontend em React e backend em Node.js, desenvolvido para Marília e Iago. O projeto utiliza uma arquitetura monorepo com PNPM workspaces.

## Tecnologias Utilizadas

### Frontend
- React 18
- Vite
- React Router
- Styled Components

### Backend
- Node.js
- Express
- Prisma ORM
- SQLite
- JWT para autenticação

## Estrutura do Projeto

```
casamento-site/
├── apps/
│   ├── client/         # Frontend React
│   └── server/         # Backend Node.js
├── pnpm-workspace.yaml
└── package.json
```

## Requisitos

- Node.js 18 ou superior
- PNPM 8 ou superior
- SQLite 3

## Instalação e Configuração

### 1. Clone o repositório e instale as dependências

```bash
git clone [URL_DO_REPOSITORIO]
cd casamento-site
pnpm install
```

### 2. Configure o Backend

```bash
cd apps/server

# Crie um arquivo .env com as seguintes variáveis
DATABASE_URL="file:../../../database.sqlite"
JWT_SECRET="casamento-marilia-iago-secret-key"
PORT=3001

# Execute as migrações do banco de dados
npx prisma migrate dev

# Popule o banco de dados com dados iniciais
npx prisma db seed
```

### 3. Configure o Frontend

```bash
cd apps/client

# Crie um arquivo .env com as seguintes variáveis
VITE_API_URL="http://localhost:3001"
```

## Executando o Projeto Localmente

### 1. Inicie o Backend

```bash
cd apps/server
npm run dev
```

### 2. Inicie o Frontend

```bash
cd apps/client
npm run dev
```

O frontend estará disponível em `http://localhost:5173` e o backend em `http://localhost:3001`.

## Deploy do Projeto

### Deploy do Backend (Render.com)

1. Crie uma conta no [Render](https://render.com/)
2. Clique em "New" e selecione "Web Service"
3. Conecte seu repositório GitHub
4. Configure o serviço:
   - Nome: `casamento-marilia-iago-backend`
   - Diretório raiz: `apps/server`
   - Comando de build: `npm install && npx prisma generate`
   - Comando de start: `npm start`
   - Adicione as variáveis de ambiente:
     - `DATABASE_URL` (use um banco PostgreSQL do Render)
     - `JWT_SECRET`
     - `PORT`
5. Clique em "Create Web Service"

### Deploy do Frontend (Vercel)

1. Crie uma conta no [Vercel](https://vercel.com/)
2. Clique em "New Project"
3. Importe seu repositório GitHub
4. Configure o projeto:
   - Framework Preset: Vite
   - Diretório raiz: `apps/client`
   - Comando de build: `npm run build`
   - Diretório de saída: `dist`
   - Adicione as variáveis de ambiente:
     - `VITE_API_URL` (URL do backend no Render)
5. Clique em "Deploy"

### Deploy do Frontend (Netlify)

1. Crie uma conta no [Netlify](https://netlify.com/)
2. Clique em "New site from Git"
3. Conecte seu repositório GitHub
4. Configure o deploy:
   - Diretório base: `apps/client`
   - Comando de build: `npm run build`
   - Diretório de publicação: `dist`
   - Adicione as variáveis de ambiente:
     - `VITE_API_URL` (URL do backend no Render)
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

Para alterar a paleta, edite o arquivo `apps/client/src/styles/GlobalStyles.jsx` e atualize as variáveis CSS no seletor `:root`.

### Alterando Textos e Conteúdo

Os textos e conteúdos podem ser editados através do painel administrativo após o login.

## Suporte

Para suporte ou dúvidas, entre em contato através do email: [seu-email@exemplo.com]
