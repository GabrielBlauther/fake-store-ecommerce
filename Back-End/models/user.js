const { getDB } = require('../db/conn');
const { ObjectId } = require('mongodb');

class UserModel {
    constructor() {
        this.collectionName = 'users';
    }

    getCollection() {
        const db = getDB();
        return db.collection(this.collectionName);
    }
    async create(userData){
        const collection = this.getCollection();
        return await collection.insertOne(userData);
    }
    //busca todos os usuarios
    async findAll(){
        const collection = this.getCollection();
        return await collection.find({}).toArray();
    }
    //busca por id
    async findById(id){
        const collection = this.getCollection();
        return await collection.findOne({ _id: new ObjectId(id)})
    }
    // Buscar usuário por email
    async findByEmail(email) {
        const collection = this.getCollection();
        return await collection.findOne({ email: email });
    }

    async updateById(id,updateData){
        const collection = this.getCollection();
        return await collection.updateOne(
            { _id: new ObjectId(id)}, //filtro de qual documento
            {$set: updateData} //dados que vão ser atualizados
        )
    }
    async deleteById(id){
        const collection= this.getCollection();
        return await collection.deleteOne({ _id: new ObjectId(id)});
    }
}

module.exports = UserModel;
