const { getDB } = require('../db/conn');
const { ObjectId } = require('mongodb');

class CartModel {
    constructor() {
        this.collectionName = 'carts';
    }

    getCollection() {
        const db = getDB();
        return db.collection(this.collectionName);
    }
    //Buscar carrinho por ID do usuário
    async findByUserId(userId) {
        const collection = this.getCollection();
        return await collection.findOne({ userId: new ObjectId(userId) });
    }
    
    //criar novo carrinho
    async create(userId) {
        const collection = this.getCollection();
        const cart = {
            userId: new ObjectId(userId),//usuario por id
            items: [],                   //Os produtos
            total: 0,                    //O valor total da compra
            createAt: new Date(),        //criação de data para o historico 
            updatedAt: new Date()        // Update da data do historico
        };
        const result = await collection.insertOne(cart);
        return{ ...cart,_id: result.isertedId};
    }

    // Adicionar item ao carrinho
    async addItem(cartId, item) {// criamos a função addItem que vai receber dois parametros, cardId e item
        const collection = this.getCollection();
        const cart = await collection.findOne({_id: new ObjectId(cartId)}) // criamos a primeira logica do cart que recebe um await para processar em segundo plano e o collection.findOne que é uma função que dentro da collection(nosso carrinho) ira criar um novo item cartId (o produto)
        
        //tratamento de erros: se o carrinho não existir
        if (!cart) {
            throw new Error('Carrinho não encontrado');
        }
        //verificar se o item ja existe no carrinho
        const existingItemIndex = cart.items.findIndex(i => i.productId.toString() === item.productId.toString());//criamos o existingItemIndex para verificar se o item já existe no carrinho usando o cart(Nosso carrinho).items(o cart.items nos permite navegar de cart para items e trabalhar somente com ele)apos usamos a função findIndex que com seus paremetros chamamos uma função i que compara os dois productId com o === (estritamente igual)
        
        if(existingItemIndex > -1){
            //atualizamos a quantidade se o item já existe 
            cart.items[existingItemIndex].quantity += item.quantity;//acessamos o items do cart e chamamos a constante que verifica se o item já existe para criarmos a condição que somara ou criara um novo item
        }else{
            //adicionar novo item
            cart.items.push({
                ...item,
                productId: new ObjectId(item.productId)
            });
        }
        //Recalcular total
        cart.total = this._calculateTotal(cart.items);
        cart.updatedAt = new Date();
        
        //Atualizar carrinho no banco
        await collection.updateOne(
            {_id: new ObjectId(cartId)},
            {$set: { items: cart.items, total: cart.total, updateAt: cart.updatedAt} }
        );

        return cart;
    }
    //limpar o carrinho
    async clearCart(cartId) {
        const collection = this.getCollection();
        await collection.updateOne(
            {_id: new ObjectId(cartId)},
            {$set: { items: [], total: 0, updatedAt: new Date()} }
        );
        return {_id: cartId, items: [], total: 0};
    }
    //calcular total
    _calculateTotal(items){
        return items.reduce((total, item) =>{
            return total + (item.price * item.quantity);},0);
    }
    
    // Remover item do carrinho
    async removeItem(cartId, productId) {
        const collection = this.getCollection();
        const cart = await collection.findOne({ _id: new ObjectId(cartId) });

        if (!cart) {
            throw new Error('Carrinho não encontrado');
        }

        // Filtra os itens, removendo o que tem o productId correspondente
        cart.items = cart.items.filter(item => item.productId.toString() !== productId.toString());

        // Recalcula o total
        cart.total = this._calculateTotal(cart.items);
        cart.updatedAt = new Date();

        // Atualiza o carrinho no banco
        await collection.updateOne(
            { _id: new ObjectId(cartId) },
            { $set: { items: cart.items, total: cart.total, updatedAt: cart.updatedAt } }
        );

        return cart;
    }

}
module.exports = CartModel;