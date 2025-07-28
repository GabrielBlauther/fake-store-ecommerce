// controllers/productController.js
const ProductModel = require('../models/products');

// Buscar todos os produtos
const getAllProducts = async (req, res) => {
    try {
        const productModel = new ProductModel();
        const products = await productModel.findAll();
        res.json(products);
    } catch (error) {
        res.status(500).json({
            error: 'Erro ao buscar produtos',
            details: error.message
        });
    }
};

// Buscar produto por ID
const getProductById = async (req, res) => {
    try {
        const productModel = new ProductModel();
        const product = await productModel.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ error: 'Produto não encontrado' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({
            error: 'Erro ao buscar produto',
            details: error.message
        });
    }
};

// Buscar categorias únicas
const getCategories = async (req, res) => {
    try {
        const productModel = new ProductModel();
        const categories = await productModel.getDistinctCategories();
        res.json(categories);
    } catch (error) {
        res.status(500).json({
            error: 'Erro ao buscar categorias',
            details: error.message
        });
    }
};

// Buscar produtos por categoria
const getProductsByCategory = async (req, res) => {
    try {
        const productModel = new ProductModel();
        const products = await productModel.findByCategory(req.params.category);
        res.json(products);
    } catch (error) {
        res.status(500).json({
            error: 'Erro ao buscar produtos por categoria',
            details: error.message
        });
    }
};

// Criar novo produto
const createProduct = async (req, res) => {
    try {
        const productModel = new ProductModel();
        const result = await productModel.create(req.body);
        res.status(201).json({
            message: 'Produto criado com sucesso',
            product: result
        });
    } catch (error) {
        res.status(500).json({
            error: 'Erro ao criar produto',
            details: error.message
        });
    }
};

// Atualizar produto
const updateProduct = async (req, res) => {
    try {
        const productModel = new ProductModel();
        const result = await productModel.updateById(req.params.id, req.body);
        if (result.matchedCount === 0) {
            return res.status(404).json({ error: 'Produto não encontrado' });
        }
        res.json({ message: 'Produto atualizado com sucesso' });
    } catch (error) {
        res.status(500).json({
            error: 'Erro ao atualizar produto',
            details: error.message
        });
    }
};

// Deletar produto
const deleteProduct = async (req, res) => {
    try {
        const productModel = new ProductModel();
        const result = await productModel.deleteById(req.params.id);
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Produto não encontrado' });
        }
        res.json({ message: 'Produto deletado com sucesso' });
    } catch (error) {
        res.status(500).json({
            error: 'Erro ao deletar produto',
            details: error.message
        });
    }
};

module.exports = {
    getAllProducts,
    getProductById,
    getCategories,
    getProductsByCategory,
    createProduct,
    updateProduct,
    deleteProduct
};