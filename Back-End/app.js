const cors = require('cors');
const express = require('express');
const app = express();

app.use(cors());
app.use(express.json());

// Conexão do banco
const { connectDB } = require('./db/conn');

// Rotas
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const cartRoutes = require('./routes/cartRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
app.use('/products', productRoutes);
app.use('/users', userRoutes);
app.use('/cart', cartRoutes);
app.use('/reviews',reviewRoutes);
const PORT = 3001;
app.get('/', (req, res) => res.send('teste'));

// IMPORTANTE: Conectar ao banco ANTES de iniciar o servidor
connectDB().then(() => {
    app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
}).catch(err => {
    console.error('Erro ao conectar com o banco:', err);
});
