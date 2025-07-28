const CartModel = require('../models/cart');
const ProductModel = require('../models/products');
const { ObjectId } = require('mongodb');
const getUserByToken = require('../helpers/get-user-by-token');
const getToken = require('../helpers/get-token');

class CartController {
    // Buscar carrinho do usuário
    static async getCart(req, res) {
        try {
            // Obter usuário pelo token
            const token = getToken(req);
            if (!token) {
                return res.status(401).json({ error: 'Acesso negado!' });
            }
            
            const user = await getUserByToken(token);
            if (!user) {
                return res.status(401).json({ error: 'Usuário não encontrado!' });
            }
            
            // Buscar carrinho do usuário
            const cartModel = new CartModel();
            let cart = await cartModel.findByUserId(user._id);
            
            // Se não existir, criar um novo
            if (!cart) {
                cart = await cartModel.create(user._id);
            }
            
            res.json(cart);
        } catch (error) {
            res.status(500).json({ 
                error: 'Erro ao buscar carrinho',
                details: error.message 
            });
        }
    }

    // Adicionar item ao carrinho
    static async addItem(req, res) {
       console.log('teste');
       
        try {
            // Obter usuário pelo token
            const token = getToken(req);
            if (!token) {
                return res.status(401).json({ error: 'Acesso negado!' });
            }
            
            const user = await getUserByToken(token);
            if (!user) {
                return res.status(401).json({ error: 'Usuário não encontrado!' });
            }
            
            // Validar dados do item
            const { productId, quantity } = req.body;
            console.log(req.body);
            if (!productId || !quantity || quantity <= 0) {
                return res.status(400).json({ 
                    error: 'Dados do produto inválidos' 
                });
            }
            
            // Buscar produto para obter preço e nome
            const productModel = new ProductModel();
            const product = await productModel.findById(productId);
            
            if (!product) {
                return res.status(404).json({ error: 'Produto não encontrado' });
            }
            
            // Buscar carrinho do usuário
            const cartModel = new CartModel();
            let cart = await cartModel.findByUserId(user._id);
            
            // Se não existir, criar um novo
            if (!cart) {
                cart = await cartModel.create(user._id);
            }
            
            // Criar item para adicionar
            const item = {
                productId: new ObjectId(productId),
                quantity: parseInt(quantity),
                price: product.price,
                name: product.title,
                image: product.image
            };
            
            // Adicionar ao carrinho
            const updatedCart = await cartModel.addItem(cart._id, item);
            
            res.json(updatedCart);
        } catch (error) {
            res.status(500).json({ 
                error: 'Erro ao adicionar item ao carrinho',
                details: error.message 
            });
        }
    }

    // Remover item do carrinho
    static async removeItem(req, res) {
        try {
            // Obter usuário pelo token
            const token = getToken(req);
            if (!token) {
                return res.status(401).json({ error: 'Acesso negado!' });
            }
            
            const user = await getUserByToken(token);
            if (!user) {
                return res.status(401).json({ error: 'Usuário não encontrado!' });
            }
            
            // Buscar carrinho do usuário
            const cartModel = new CartModel();
            const cart = await cartModel.findByUserId(user._id);
            
            if (!cart) {
                return res.status(404).json({ error: 'Carrinho não encontrado' });
            }
            
            // Remover item
            const productId = req.params.productId;
            const updatedCart = await cartModel.removeItem(cart._id, productId);
            
            res.json(updatedCart);
        } catch (error) {
            res.status(500).json({ 
                error: 'Erro ao remover item do carrinho',
                details: error.message 
            });
        }
    }

    // Atualizar quantidade de um item
    static async updateItemQuantity(req, res) {
        try {
            // Obter usuário pelo token
            const token = getToken(req);
            if (!token) {
                return res.status(401).json({ error: 'Acesso negado!' });
            }
            
            const user = await getUserByToken(token);
            if (!user) {
                return res.status(401).json({ error: 'Usuário não encontrado!' });
            }
            
            // Validar dados
            const { quantity } = req.body;
            const productId = req.params.productId;
            
            if (!quantity || isNaN(quantity)) {
                return res.status(400).json({ 
                    error: 'Quantidade inválida' 
                });
            }
            
            // Buscar carrinho do usuário
            const cartModel = new CartModel();
            const cart = await cartModel.findByUserId(user._id);
            
            if (!cart) {
                return res.status(404).json({ error: 'Carrinho não encontrado' });
            }
            
            // Atualizar quantidade
            const updatedCart = await cartModel.updateItemQuantity(
                cart._id, 
                productId, 
                parseInt(quantity)
            );
            
            res.json(updatedCart);
        } catch (error) {
            res.status(500).json({ 
                error: 'Erro ao atualizar quantidade',
                details: error.message 
            });
        }
    }

    // Limpar carrinho
    static async clearCart(req, res) {
        try {
            // Obter usuário pelo token
            const token = getToken(req);
            if (!token) {
                return res.status(401).json({ error: 'Acesso negado!' });
            }
            
            const user = await getUserByToken(token);
            if (!user) {
                return res.status(401).json({ error: 'Usuário não encontrado!' });
            }
            
            // Buscar carrinho do usuário
            const cartModel = new CartModel();
            const cart = await cartModel.findByUserId(user._id);
            
            if (!cart) {
                return res.status(404).json({ error: 'Carrinho não encontrado' });
            }
            
            // Limpar carrinho
            const emptyCart = await cartModel.clearCart(cart._id);
            
            res.json(emptyCart);
        } catch (error) {
            res.status(500).json({ 
                error: 'Erro ao limpar carrinho',
                details: error.message 
            });
        }
    }
}


module.exports = CartController;
