const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27090';
const dbName = 'fakestore';

let db;

const connectDB = async () => {
    try {
        const client = new MongoClient(uri);
        await client.connect();
        db = client.db(dbName);
        console.log('Conectado ao banco de dados');
        return db;
    } catch (err) {
        console.error('Erro ao conectar ao banco:', err);
        process.exit(1);
    }
};

const getDB = () => {
    if (!db) {
        throw new Error('Banco não conectado');
    }
    return db;
};

module.exports = { connectDB, getDB };
