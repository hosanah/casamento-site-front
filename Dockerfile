# Dockerfile multi-estágio para ambiente de desenvolvimento e produção
# Imagem base para ambos os ambientes
FROM node:18-alpine as base

# Diretório de trabalho
WORKDIR /app

# Copiar arquivos de configuração
COPY client/package*.json ./

# Instalar dependências
RUN npm ci

# Estágio de desenvolvimento
FROM base as development
WORKDIR /app

# Copiar todo o código fonte
COPY client/ ./

# Expor porta para desenvolvimento
EXPOSE 5173

# Comando para iniciar em modo desenvolvimento
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# Estágio de build
FROM base as build
WORKDIR /app

# Copiar todo o código fonte
COPY client/ ./

# Construir a aplicação
RUN npm run build

# Estágio de produção
FROM nginx:alpine as production

# Copiar configuração personalizada do nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Configuração do Nginx para SPA (Single Page Application)
RUN echo 'server { \
    listen 80; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Expor porta para produção
EXPOSE 80

# Comando para iniciar o Nginx
CMD ["nginx", "-g", "daemon off;"]
