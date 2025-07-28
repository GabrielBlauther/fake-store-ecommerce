const express = require('express');
const router = express.Router();
const ReviewController = require('../controllers/reviewController');

// Buscar avaliações por produto
router.get('/product/:productId', ReviewController.getReviewsByProduct);

// Criar avaliação
router.post('/add', ReviewController.createReview);

module.exports = router;
