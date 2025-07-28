const express = require('express');
const router = express.Router()
const CartController = require('../controllers/cartController');
const verifyToken = require('../helpers/verify-token');

router.use(verifyToken);

//Buscar carrinho do usuario
router.get('/', CartController.getCart);

//Adicionar produto ao carrinho
router.post('/add',CartController.addItem);

//Remover produto do carrinho
router.delete('/remove/:productId', CartController.removeItem);

//Atualizar a quantidade
router.put('/update/:productId', CartController.updateItemQuantity);

//limpar carrinho
router.delete('/clear', CartController.clearCart);

module.exports = router;