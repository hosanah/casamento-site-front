# Instruções para Execução do Projeto com Docker

Este documento contém instruções detalhadas para executar o projeto tanto em ambiente de desenvolvimento quanto em produção utilizando Docker.

## Pré-requisitos

- Docker instalado (versão 20.10.0 ou superior)
- Docker Compose (opcional, para facilitar o gerenciamento)

## Estrutura do Dockerfile

O Dockerfile fornecido é multi-estágio e permite executar a aplicação em dois modos:
- **Desenvolvimento**: com hot-reload e todas as ferramentas de desenvolvimento
- **Produção**: otimizado, com Nginx para servir os arquivos estáticos

## Comandos para Ambiente de Desenvolvimento

Para construir e iniciar a aplicação em modo de desenvolvimento:

```bash
# Construir a imagem de desenvolvimento
docker build --target development -t casamento-site-dev .

# Executar o container em modo de desenvolvimento
docker run -p 5173:5173 -v $(pwd)/client:/app --name casamento-dev casamento-site-dev
```

Isso iniciará o servidor de desenvolvimento do Vite na porta 5173 com hot-reload ativado. Você pode acessar a aplicação em `http://localhost:5173`.

### Características do Ambiente de Desenvolvimento
- Hot-reload ativado (as alterações no código são refletidas automaticamente)
- Volume montado para permitir edição de arquivos em tempo real
- Todas as ferramentas de desenvolvimento disponíveis

## Comandos para Ambiente de Produção

Para construir e iniciar a aplicação em modo de produção:

```bash
# Construir a imagem de produção
docker build --target production -t casamento-site-prod .

# Executar o container em modo de produção
docker run -p 80:80 --name casamento-prod casamento-site-prod
```

Isso iniciará um servidor Nginx na porta 80 servindo os arquivos estáticos otimizados. Você pode acessar a aplicação em `http://localhost`.

### Características do Ambiente de Produção
- Build otimizado para melhor performance
- Servidor Nginx configurado para Single Page Application (SPA)
- Configuração de cache e compressão para melhor desempenho

## Usando Docker Compose (Opcional)

Para facilitar o gerenciamento, você pode usar Docker Compose. Crie um arquivo `docker-compose.yml` com o seguinte conteúdo:

```yaml
version: '3.8'

services:
  # Serviço de desenvolvimento
  dev:
    build:
      context: .
      target: development
    ports:
      - "5173:5173"
    volumes:
      - ./client:/app
    container_name: casamento-dev

  # Serviço de produção
  prod:
    build:
      context: .
      target: production
    ports:
      - "80:80"
    container_name: casamento-prod
```

E então execute:

```bash
# Para ambiente de desenvolvimento
docker-compose up dev

# Para ambiente de produção
docker-compose up prod
```

## Solução de Problemas

### Problema de Permissão
Se encontrar problemas de permissão ao montar volumes:

```bash
# Execute o container com seu usuário atual
docker run -p 5173:5173 -v $(pwd)/client:/app --user $(id -u):$(id -g) --name casamento-dev casamento-site-dev
```

### Porta já em uso
Se a porta estiver em uso, altere o mapeamento:

```bash
# Para desenvolvimento (usando porta 3000 local)
docker run -p 3000:5173 --name casamento-dev casamento-site-dev

# Para produção (usando porta 8080 local)
docker run -p 8080:80 --name casamento-prod casamento-site-prod
```

## Notas Importantes

1. O Dockerfile foi otimizado para a estrutura atual do projeto, que contém apenas o frontend React/Vite no diretório `client/`.
2. A configuração do Nginx em produção está otimizada para Single Page Applications (SPA) com React Router.
3. Para desenvolvimento, as alterações feitas nos arquivos locais são refletidas automaticamente no container devido ao volume montado.
