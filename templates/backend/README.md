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

```bash
cd meu-projeto
npm install
npm run prisma:dev
npm run start:dev
```
