# SDD — Boilerplate NestJS API

**Projeto:** miracle-nest-boilerplate
**Versão:** 2.0.0
**Data:** 2026-07-31
**Descrição:** Documento consolidado de arquitetura para uma API NestJS reutilizável, com Prisma, PostgreSQL, autenticação JWT, refresh token, RBAC, permissões granulares, recuperação de senha, respostas padronizadas e estrutura pronta para virar boilerplate publicado via npm.

---

## 1. Visão Geral

Este documento une duas perspectivas do projeto:

1. a base técnica de uma API NestJS já estruturada para autenticação, usuários, perfis e recuperação de senha; e
2. a visão de boilerplate reutilizável, com arquitetura padronizada para ser copiada por outros projetos.

A proposta central é transformar a aplicação em uma base pronta para iniciar novos projetos, mantendo boa separação de responsabilidades, contratos claros e uma estrutura que facilite manutenção, testes e geração de novos módulos.

O objetivo não é apenas entregar um projeto funcional, mas um template com:

- camadas bem definidas;
- padrão de repository para acesso ao banco;
- Prisma modular e versionado;
- auth e autorização reutilizáveis;
- estrutura de pastas preparada para crescimento;
- possibilidade de publicar como CLI ou template.

---

## 2. Objetivo da Arquitetura

O fluxo principal segue este padrão:

Controller -> Service -> Repository -> Prisma

Responsabilidades:

- Controller: recebe HTTP, aplica decorators, Swagger, guards e chama o service.
- Service: concentra regra de negócio e orquestração.
- Repository: concentra persistência, queries Prisma, includes, selects, count e transações.
- Shared: guarda contratos e implementações reutilizáveis entre módulos.
- Common: guarda infraestrutura genérica da API.
- Config: guarda providers globais e integrações externas.
- Prisma: guarda schema, migrations e client gerado.
- Scripts: guarda seeds e rotinas executáveis.

Regra central: services não devem acessar Prisma diretamente; eles dependem de repositories.

---

## 3. Stack Tecnológica

| Tecnologia | Uso |
|---|---|
| Node.js 20 | Runtime |
| NestJS | Framework principal |
| TypeScript | Linguagem |
| Prisma ORM | Acesso ao banco de dados |
| PostgreSQL | Banco relacional |
| Docker / Compose | Subir o banco localmente |
| class-validator | Validação dos DTOs |
| class-transformer | Transformação de dados |
| @nestjs/config | Variáveis de ambiente |
| @nestjs/jwt | Geração e validação de access token |
| @nestjs/passport + passport-jwt | Strategy JWT |
| @nestjs/throttler | Rate limiting |
| @nestjs/swagger | Documentação OpenAPI |
| bcrypt | Hash de senha e de código de recuperação |
| nodemailer | Envio genérico de e-mail |

---

## 4. Princípios Arquiteturais

### 4.1 Separação de camadas

- Controllers não implementam regra de negócio.
- Services não acessam Prisma diretamente.
- Repositories não contêm lógica de negócio.
- DTOs definem contratos de entrada/saída.
- Mappers convertem entidades do Prisma para objetos de resposta.

### 4.2 Reutilização

- Tudo que é genérico fica em Common ou Shared.
- Modulos específicos ficam em src/modules.
- Providers externos ficam em src/config.

### 4.3 Segurança

- Senhas devem ser armazenadas como hash.
- Refresh tokens devem ser opacos e persistidos com hash.
- Códigos de recuperação devem ser hasheados e ter expiração.
- Respostas e erros devem ser padronizados.

---

## 5. Estrutura de Pastas

```text
miracle-nest-boilerplate/
  prisma/
    schema.prisma
    schemas/
      user.prisma
      role.prisma
      permission.prisma
      user-role.prisma
      user-permission.prisma
      role-permission.prisma
      refresh-token.prisma
      password-reset-code.prisma
    migrations/
    generated/

  src/
    app.module.ts
    main.ts

    config/
      orm.ts
      mail.ts
      bucket.ts
      password-generate.ts

    common/
      constants/
        config.ts
        exception.enum.ts
        roles.ts
      decorators/
        current-user.decorator.ts
        permissions.decorator.ts
        public.decorator.ts
        roles.decorator.ts
      dto/
        list-query.dto.ts
      filters/
        http-exception.filter.ts
        validation-exception.filter.ts
      guards/
        jwt-auth.guard.ts
        permissions.guard.ts
        roles.guard.ts
      health/
        health.controller.ts
        health.module.ts
      interceptors/
        logging.interceptor.ts
      mail/
        console-mail.service.ts
        mail.module.ts
        mail.service.ts
        nodemailer-mail.service.ts
      middlewares/
        correlation-id.middleware.ts
        logger.middleware.ts
      responses/
        api-response.ts
      strategies/
        auth/
      templates/
      utils/

    shared/
      @types/
      constants/
      dto/
      enums/
      repository/
        interfaces/
        selects/
        mappers/
      swagger/

    modules/
      auth/
      role/
      user/
      user-role/

    scripts/
      role.seed.ts
      permissions.seed.ts
      dev-user.seed.ts

  tools/
    devkit/
      src/
        index.ts
        templates/
```

---

## 6. Organização por Camada

### 6.1 src/config

Contém integrações e providers globais. Não deve armazenar regra de negócio.

Exemplos:

- orm.ts: configuração do PrismaService e módulo global
- mail.ts: provider de e-mail
- bucket.ts: storage opcional
- password-generate.ts: utilidades relacionadas a senha

### 6.2 src/common

Contém infraestrutura comum a toda API.

Inclui:

- decorators de auth/autorização;
- guards (JwtAuthGuard, RolesGuard, PermissionsGuard);
- filters de erro;
- interceptors de logging;
- middlewares de correlação e log;
- respostas padronizadas;
- templates reutilizáveis;
- utilidades genéricas.

### 6.3 src/shared

Guarda recursos reutilizáveis entre módulos.

Exemplos:

- DTOs compartilhados de resposta;
- interfaces de repositories;
- selects Prisma reutilizáveis;
- mappers;
- entidades Swagger;
- tipos compartilhados.

### 6.4 src/modules

Guarda as funcionalidades de negócio por domínio.

Módulos base do boilerplate:

- auth
- user
- role
- user-role

---

## 7. Prisma e Banco de Dados

### 7.1 Estrutura do Prisma

O schema deve ser dividido por arquivos para facilitar manutenção.

Estrutura recomendada:

- prisma/schema.prisma: datasource e generator
- prisma/schemas/user.prisma
- prisma/schemas/role.prisma
- prisma/schemas/permission.prisma
- prisma/schemas/user-role.prisma
- prisma/schemas/user-permission.prisma
- prisma/schemas/role-permission.prisma
- prisma/schemas/refresh-token.prisma
- prisma/schemas/password-reset-code.prisma

### 7.2 Modelos principais

Exemplos de modelos:

```prisma
model User {
  id             String         @id @default(uuid())
  name           String
  email          String         @unique
  hashedPassword String
  createdAt      DateTime       @default(now())
  updatedAt      DateTime       @updatedAt

  userRoles          UserRole[]
  refreshTokens      RefreshToken[]
  passwordResetCodes PasswordResetCode[]
}
```

```prisma
model Role {
  id        String     @id @default(uuid())
  name      String     @unique
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt

  userRoles UserRole[]
}
```

```prisma
model RefreshToken {
  id        String   @id @default(uuid())
  tokenHash String   @unique
  userId    String
  expiresAt DateTime
  createdAt DateTime @default(now())

  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
}
```

```prisma
model PasswordResetCode {
  id        String   @id @default(uuid())
  codeHash  String
  userId    String
  attempts  Int      @default(0)
  expiresAt DateTime
  createdAt DateTime @default(now())

  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
}
```

Regras de design:

- migrations devem ser versionadas;
- relações importantes devem usar onDelete: Cascade;
- campos sensíveis devem permanecer fora de selects padrão;
- índices devem existir para chaves de busca frequente.

---

## 8. Módulos Base

### 8.1 Módulo Auth

Responsável por:

- login;
- refresh token;
- logout;
- forgot password;
- reset password.

Fluxo de login:

1. Controller recebe email e senha.
2. Service valida o usuário via repository.
3. Service compara senha com hash bcrypt.
4. Service busca roles e gera access token.
5. Service gera refresh token opaco e persiste seu hash.
6. Controller retorna resposta padronizada.

### 8.2 Módulo User

Responsável por:

- cadastro;
- busca/listagem;
- atualização de perfil;
- alteração de senha;
- ativação/desativação;
- endpoints de perfil atual.

### 8.3 Módulo Role

Responsável por:

- CRUD de perfis;
- associação de roles a usuários;
- paginação de listagem.

### 8.4 Módulo UserRole

Responsável por:

- criar/remover associação usuário-role;
- listar roles de um usuário.

---

## 9. Autenticação e Autorização

### 9.1 JWT e refresh token

- O access token é JWT.
- O refresh token é opaco e persistido com hash.
- O refresh token é usado para rotação e revogação imediata.

### 9.2 RBAC e permissões

A autorização deve ser baseada em:

- roles: perfil do usuário;
- permissions: permissões granulares.

Decorators recomendados:

- @Public(): rota pública
- @Roles(...): exigência por role
- @Permissions(...): exigência por permissões

Guards recomendados:

- JwtAuthGuard: autenticação
- RolesGuard: autorização por role
- PermissionsGuard: autorização por permissão

### 9.3 Fluxo de recuperação de senha

O fluxo consiste em:

1. POST /auth/forgot-password: gera código de 6 dígitos e envia por e-mail.
2. POST /auth/reset-password: valida o código e redefine a senha.
3. Todos os refresh tokens do usuário são revogados após sucesso.

---

## 10. Respostas Padronizadas

Todas as respostas da API devem seguir um envelope único.

### 10.1 Estrutura de sucesso

```json
{
  "sucesso": true,
  "mensagem": "Usuário criado com sucesso",
  "dados": {},
  "timestamp": "2026-07-31T00:00:00.000Z"
}
```

### 10.2 Estrutura de erro

```json
{
  "sucesso": false,
  "mensagem": "Dados inválidos",
  "dados": null,
  "statusCode": 400,
  "timestamp": "2026-07-31T00:00:00.000Z"
}
```

Mensagens padrão recomendadas:

- Usuário criado com sucesso
- Usuário encontrado
- Usuários listados com sucesso
- Usuário atualizado com sucesso
- Usuário removido com sucesso
- Login realizado com sucesso
- Token renovado com sucesso
- Logout realizado com sucesso
- Senha alterada com sucesso
- Senha redefinida com sucesso
- Código inválido ou expirado

---

## 11. Convenções de Código

- Arquivos em kebab-case.
- Classes em PascalCase.
- Métodos e propriedades em camelCase.
- DTOs com class-validator e class-transformer.
- Repositories sem lógica de negócio.
- Services sem acesso direto ao Prisma.
- Mappers sem lógica de negócio.
- Controllers sem acesso ao banco.
- Variáveis de ambiente via ConfigService.

---

## 12. Variáveis de Ambiente

Exemplo de .env.example:

```env
PORT=3000
NODE_ENV=development
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/nest_base_db"
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=nest_base_db
JWT_ACCESS_SECRET=seu_secret_access_aqui
JWT_ACCESS_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN_DAYS=7
THROTTLE_TTL=60
THROTTLE_LIMIT=10
RESET_CODE_EXPIRES_IN_MINUTES=15
RESET_CODE_MAX_ATTEMPTS=5
MAIL_DRIVER=console
MAIL_FROM="no-reply@nest-base-api.com"
SMTP_HOST=localhost
SMTP_PORT=1025
SMTP_SECURE=false
SMTP_USER=
SMTP_PASSWORD=
CORS_ORIGIN=http://localhost:3000
AUTH_FIXED_RESET_CODE_ENABLED=false
AUTH_FIXED_RESET_CODE=123456
```

---

## 13. Docker e Ambiente Local

### 13.1 docker-compose

Exemplo:

```yaml
services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    ports:
      - '5432:5432'
    volumes:
      - postgres_data:/var/lib/postgresql/data

  mailhog:
    image: mailhog/mailhog:latest
    ports:
      - '1025:1025'
      - '8025:8025'
    profiles: ['mail']

volumes:
  postgres_data:
```

---

## 14. Qualidade, Observabilidade e Segurança

Itens obrigatórios do boilerplate:

- Health check em /health
- Swagger em /docs em ambientes não-públicos
- Rate limiting nas rotas sensíveis de auth
- CORS configurável por env
- Logging global de requests
- Testes unitários e e2e
- Migrations versionadas
- Seeds idempotentes

---

## 15. Scripts e Seeds

Os scripts devem ser idempotentes.

Exemplos:

- role.seed.ts: cria roles padrão
- permissions.seed.ts: cria permissões padrão
- dev-user.seed.ts: cria usuário admin inicial

Comandos recomendados:

```json
{
  "scripts": {
    "dev": "nest start --watch",
    "build": "nest build",
    "prisma:generate": "prisma generate --schema prisma/schema",
    "prisma:dev": "prisma migrate dev --schema prisma/schema",
    "prisma:deploy": "prisma migrate deploy --schema prisma/schema",
    "seed": "npm run prisma:generate && npm run seed:roles && npm run seed:permissions && npm run seed:dev-user",
    "g:res": "tsx tools/devkit/src/index.ts res"
  }
}
```

---

## 16. Devkit para Geração de Módulos

A pasta tools/devkit é um diferencial importante para o boilerplate.

Ela pode gerar automaticamente:

- controller
- service
- module
- DTOs
- repository
- interface de repository
- mapper
- entidade Prisma/Swagger

---

## 17. Fluxo de Criação de um Novo Módulo

1. Criar model Prisma em prisma/schemas/<resource>.prisma.
2. Rodar migration e generate.
3. Criar DTOs de entrada em src/modules/<resource>/dto.
4. Criar DTOs compartilhados em src/shared/dto quando forem reutilizáveis.
5. Criar repository em src/shared/repository.
6. Criar interface em src/shared/repository/interfaces.
7. Criar selects/mappers conforme necessário.
8. Implementar service.
9. Implementar controller.
10. Registrar module no AppModule.
11. Atualizar Swagger.
12. Criar seed se necessário.

---

## 18. O que Copiar para o Boilerplate

Copiar como base:

- src/config/orm.ts
- src/common/decorators
- src/common/guards
- src/common/filters
- src/common/interceptors
- src/common/strategies/auth
- src/common/utils/exceptions.ts
- src/shared/repository
- src/shared/dto
- src/shared/swagger
- src/modules/auth
- src/modules/user
- src/modules/role
- src/modules/user-role
- src/scripts
- tools/devkit

### 18.1 O que não copiar diretamente

- módulos específicos de domínio do projeto final;
- DTOs e Swagger de negócio específicos;
- seeds de domínio;
- migrations de domínio que não sejam comuns ao boilerplate base.

---

## 19. Estratégia de Publicação como Boilerplate

Para publicar como boilerplate, a estrutura mínima recomendada é:

```text
nest-api-boilerplate/
  package.json
  README.md
  nest-cli.json
  tsconfig.json
  tsconfig.build.json
  prisma/
  src/
  tools/
  .env.example
```

O pacote CLI pode ser publicado no npm para gerar projetos a partir do template.

---

## 20. Próximos Passos de Implementação

1. Ajustar o Prisma para o modelo base do boilerplate.
2. Consolidar os módulos auth, user, role e user-role com repository pattern.
3. Implementar guards, decorators e filtros globais.
4. Adicionar seeds e configuração de ambiente.
5. Criar testes unitários e e2e.
6. Validar o fluxo de login, refresh, forgot/reset password e RBAC.
7. Transformar a estrutura em template reutilizável.

---

## 21. Resumo Executivo

Este SDD define uma base sólida para uma API NestJS moderna, segura e extensível. A arquitetura prioriza:

- separação clara de responsabilidades;
- uso consistente de repositories;
- Prisma modular e versionado;
- autenticação/autorização reutilizáveis;
- contratos de API padronizados;
- estrutura pronta para crescer e virar boilerplate.

A aplicação deve ser construída pensando em reutilização, não apenas em um projeto único.
