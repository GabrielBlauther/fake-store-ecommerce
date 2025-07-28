#  Fake Store E-commerce

Plataforma de e-commerce completa desenvolvida durante meu programa de estágio na **Marcopolo S.A.** como parte do treinamento técnico para preparação ao ambiente de trabalho real da empresa.

##  Sobre o Projeto

Sistema full-stack de loja virtual com autenticação, catálogo de produtos, carrinho de compras e sistema de avaliações.

##  Tecnologias

**Backend:**
- Node.js + Express
- MongoDB + Drive Nativo
- JWT Authentication
- Bcrypt

**Frontend:**
- React 19
- React Router DOM
- Axios
- React Query

## 📁 Estrutura

```
├── Back-End/           # API REST
│   ├── controllers/    # Lógica de negócio
│   ├── models/        # Modelos MongoDB
│   ├── routes/        # Rotas da API
│   └── helpers/       # Utilitários JWT
└── Front-end/         # Aplicação React
    └── fakestore/
```

##  Instalação

**Backend:**
```bash
cd Back-End
npm install
npm run dev
```

**Frontend:**
```bash
cd Front-end/fakestore
npm install
npm start
```

##  API Endpoints

- `POST /users/register` - Cadastro
- `POST /users/login` - Login
- `GET /products` - Listar produtos
- `POST /cart/add` - Adicionar ao carrinho
- `POST /reviews` - Criar avaliação

##  Funcionalidades

-  Autenticação JWT
-  CRUD de produtos
-  Carrinho de compras
-  Sistema de reviews
-  Interface responsiva

##  Desenvolvimento

Este projeto foi desenvolvido como parte do programa de estágio na **Marcopolo S.A.**, focando no aprendizado de tecnologias modernas e boas práticas de desenvolvimento para preparação ao ambiente corporativo.

**Autor:** Gabriel Blauther  
**Empresa:** Marcopolo S.A. (Estágio)  
**Período:** 2025

---
