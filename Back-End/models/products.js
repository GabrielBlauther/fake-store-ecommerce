const { getDB } = require('../db/conn');
const { ObjectId } = require('mongodb');

class ProductModel {
    constructor() {
        this.collectionName = 'products';
    }

    getCollection() {
        const db = getDB();
        return db.collection(this.collectionName);
    }

    async create(productData) {
        const collection = this.getCollection();
        return await collection.insertOne(productData);
    }

    async findAll() {
        const collection = this.getCollection();
        return await collection.find({}).toArray();
    }

    async findById(id) {
        const collection = this.getCollection();
        return await collection.findOne({ _id: new ObjectId(id) });
    }

    async findByCategory(category) {
        const collection = this.getCollection();
        return await collection.find({ category: category }).toArray();
    }

    async getDistinctCategories() {
        const collection = this.getCollection();
        return await collection.distinct('category');
    }

    async updateById(id, updateData) {
        const collection = this.getCollection();
        return await collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData }
        );
    }

    async deleteById(id) {
        const collection = this.getCollection();
        return await collection.deleteOne({ _id: new ObjectId(id) });
    }
}

module.exports = ProductModel;
