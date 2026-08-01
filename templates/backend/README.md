# Miracle Nest Boilerplate

Este repositório agora funciona como uma base de boilerplate para gerar novos projetos NestJS com Prisma, PostgreSQL, auth, roles e recuperação de senha.

## Gerar um novo projeto

```bash
node cli/bin/create.js meu-projeto
```

Isso cria uma cópia do template no diretório `meu-projeto`, substituindo:

- nome do projeto;
- nome do banco PostgreSQL;
- título da API no Swagger;
- referências internas ao template original.

## Próximos passos no projeto gerado

### Setup com Docker (Recomendado)

1. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

2. Inicie o banco PostgreSQL com Docker Compose:
```bash
docker-compose up -d
```

3. Instale as dependências e execute as migrações:
```bash
npm install
npm run prisma:dev
npm run start:dev
```

### Setup local (sem Docker)

Se você já tiver PostgreSQL instalado localmente:

```bash
npm install
npm run prisma:dev
npm run start:dev
```

Certifique-se de que as variáveis de ambiente em `.env` apontam para sua instância local do PostgreSQL.

## Docker Compose

O arquivo `docker-compose.yml` inicia um container PostgreSQL com as configurações necessárias.

**Variáveis de ambiente:**
- `DB_USER`: usuário do PostgreSQL (padrão: postgres)
- `DB_PASSWORD`: senha do PostgreSQL (padrão: postgres)
- `DB_NAME`: nome do banco (padrão: miracle_db)
- `DB_PORT`: porta do PostgreSQL (padrão: 5432)

**Comandos úteis:**
```bash
# Iniciar os serviços
docker-compose up -d

# Parar os serviços
docker-compose down

# Ver logs
docker-compose logs -f postgres

# Remover volume de dados (CUIDADO: deleta os dados)
docker-compose down -v
```
