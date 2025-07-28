const ReviewModel = require('../models/reviews');
const ProductModel = require('../models/products');
const { ObjectId } = require('mongodb');
const getUserByToken = require('../helpers/get-user-by-token');
const getToken = require('../helpers/get-token');

class ReviewController{
    //Criar uma nova avaliação 
    static async createReview(req, res){
        try{
            //Obter usuário pelo token
            const token = getToken(req)
            if(!token){
                return res.status(401).json({error: 'Acesso negado!'});
            }
            const user = await getUserByToken(token)
            if(!user){
                return res.status(401).json({error: 'Acesso negado!'});
            }
            const { productId, rating} = req.body;
            if(!productId || !rating) {
                return res.status(400).json({ error: 'Dados incompletos.'});
            }
            
            const reviewModel = new ReviewModel();
            
            const alreadyReviewed = await reviewModel.hasUserReviewed(user._id, productId);
            if(alreadyReviewed){
                return res.status(409).json({error: 'Você já avaliou este produto.'});
            }
            //Criar avaliação
            const review = await reviewModel.create({
                userId: user._id,
                productId,
                rating
            });

            res.status(201).json(review);
        } catch (error) {
            res.status(500).json({
                error: 'Erro ao criar avaliação',
                details: error.message
            });
        }
    }
    
    // Buscar avaliações de um produto
    static async getReviewsByProduct(req, res) {
        try {
            const { productId } = req.params;

            if (!productId) {
                return res.status(400).json({ error: 'ID do produto não fornecido.' });
            }

            const reviewModel = new ReviewModel();
            const reviews = await reviewModel.findByProductId(productId);

            res.json(reviews);
        } catch (error) {
            res.status(500).json({
                error: 'Erro ao buscar avaliações',
                details: error.message
            });
        }
    }
}

module.exports = ReviewController;
