# Guia de Implantação no EasyPanel

Este documento explica como implantar o frontend do site de casamento no EasyPanel usando o Dockerfile fornecido.

## Sobre o Dockerfile

O Dockerfile incluído neste repositório está configurado para:

1. Construir a aplicação React/Vite em um ambiente Node.js
2. Servir os arquivos estáticos gerados usando Nginx
3. Configurar o Nginx para suportar roteamento de SPA (Single Page Application)

## Passos para Implantação no EasyPanel

### 1. Preparação

Certifique-se de que:
- Você tem acesso ao painel do EasyPanel
- O repositório Git está acessível ao EasyPanel (público ou com credenciais configuradas)

### 2. Criação do Serviço no EasyPanel

1. Acesse o painel do EasyPanel
2. Clique em "Novo Serviço" ou "Adicionar Serviço"
3. Selecione "Aplicação Web" ou "Aplicação Personalizada"

### 3. Configuração do Serviço

Configure o serviço com as seguintes informações:

- **Nome do Serviço**: casamento-site-frontend (ou outro nome de sua preferência)
- **Método de Implantação**: Git
- **Repositório Git**: https://github.com/hosanah/casamento-site-front.git
- **Branch**: main (ou a branch que deseja implantar)
- **Dockerfile Path**: ./Dockerfile
- **Porta Exposta**: 80 (já configurada no Dockerfile)

### 4. Variáveis de Ambiente (Opcional)

Se necessário, configure as variáveis de ambiente para apontar para o backend:

- `VITE_BACKEND_URL`: URL completa do seu backend (ex: https://api.seudominio.com)

### 5. Recursos (Recomendado)

Recomendações de recursos para o serviço:
- **CPU**: 0.5-1 vCPU
- **Memória**: 512MB-1GB
- **Armazenamento**: 1GB

### 6. Implantação

1. Clique em "Criar" ou "Implantar"
2. O EasyPanel irá clonar o repositório e construir a imagem Docker
3. Após a conclusão do build, o serviço estará disponível na URL fornecida pelo EasyPanel

## Atualizações

Para atualizar o site após alterações no código:

1. Envie as alterações para o repositório Git
2. No EasyPanel, acesse o serviço e clique em "Reimplantar" ou "Reconstruir"

## Solução de Problemas

Se encontrar problemas durante a implantação:

1. Verifique os logs de build no EasyPanel
2. Certifique-se de que todas as variáveis de ambiente necessárias estão configuradas
3. Verifique se o EasyPanel tem acesso ao repositório Git

## Notas Adicionais

- O Dockerfile está configurado para servir uma aplicação SPA, redirecionando todas as rotas para o index.html
- A configuração do Nginx está otimizada para servir arquivos estáticos eficientemente
- O build é realizado em um estágio separado para manter a imagem final pequena e eficiente
