
const { getDB } = require('../db/conn');
const { ObjectId } = require('mongodb');

class ReviewModel {
    constructor(){
       this.collectionName='reviews';
    }

    getCollection(){
        const db = getDB();
        return db.collection(this.collectionName);
    }

    async create({ userId, productId, rating}) {
        const collection = this.getCollection();

        const review = {
            userId: new ObjectId(userId),
            productId:  new ObjectId(productId),
            rating,
            createdAt: new Date()
        };

        const result = await collection.insertOne(review);

        return {...review, _id: result.insertedId}
    }
    
    // Buscar avaliações por produto
    async findByProductId(productId) {
        const collection = this.getCollection();
        return await collection.find({ productId: new ObjectId(productId) }).toArray();
    }

    // Verificar se o usuário já avaliou o produto
    async hasUserReviewed(userId, productId) {
        const collection = this.getCollection();
        const review = await collection.findOne({
            userId: new ObjectId(userId),
            productId: new ObjectId(productId)
        });
        return !!review;
    }
}


module.exports = ReviewModel;
