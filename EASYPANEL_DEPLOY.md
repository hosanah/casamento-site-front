# Instruções para Implantação no EasyPanel

Este arquivo contém instruções para implantar o site de casamento no EasyPanel usando Docker.

## Pré-requisitos

- Acesso ao EasyPanel
- Repositório do projeto clonado

## Arquivos Necessários

- Dockerfile (incluído neste repositório)
- Banco de dados SQLite (se já existir)

## Passos para Implantação

1. **Preparar o Projeto**:
   - Certifique-se de que o Dockerfile está na raiz do projeto
   - Verifique se o banco de dados SQLite está na raiz (se aplicável)

2. **Configurar no EasyPanel**:
   - Acesse o painel do EasyPanel
   - Clique em "Criar nova aplicação"
   - Selecione "Docker" como tipo de aplicação
   - Conecte ao repositório Git ou faça upload dos arquivos

3. **Configurações do Docker**:
   - Porta: 3001 (a mesma exposta no Dockerfile)
   - Variáveis de ambiente (se necessário):
     - `NODE_ENV=production`
     - `DATABASE_URL=file:../../../database.sqlite`
     - `JWT_SECRET=seu_segredo_jwt` (substitua por um valor seguro)

4. **Volumes (Opcional)**:
   - Se quiser persistência de dados, configure um volume para `/app/apps/server/public/uploads`
   - Configure um volume para o banco de dados: `/app/apps/server/database.sqlite`

5. **Implantação**:
   - Clique em "Implantar"
   - Aguarde a conclusão do build e implantação

## Notas Importantes

- O Dockerfile já configura automaticamente:
  - Build do frontend React/Vite
  - Instalação de dependências com pnpm
  - Geração do Prisma Client
  - Execução das migrações do banco de dados
  - Criação de diretórios necessários para uploads

- Para acessar o site após a implantação, use a URL fornecida pelo EasyPanel

## Solução de Problemas

- Se encontrar problemas com permissões de arquivos, verifique os volumes configurados
- Para visualizar logs, use a interface do EasyPanel
- Se precisar modificar o banco de dados, você pode acessar o terminal da aplicação através do EasyPanel
