const express = require('express');
const router = express.Router();

const{ 
    getAllProducts,
    getProductById,
    getCategories,
    getProductsByCategory,
    createProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/productController');

// Buscar todos os produtos
router.get('/', getAllProducts);

// Buscar todas as categorias (ANTES de /:id)
router.get('/categories', getCategories);

// Buscar por categoria (ANTES de /:id)
router.get('/category/:category', getProductsByCategory);

// Buscar produto por ID (DEPOIS das rotas específicas)
router.get('/:id', getProductById);

// Criar produto
router.post('/', createProduct);

// Atualizar produto
router.put('/:id', updateProduct);

// Deletar produto
router.delete('/:id', deleteProduct);

module.exports = router;
