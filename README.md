#  Fake Store E-commerce

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

**Autor:** Gabriel Blauther  
**Período:** 2025

---
