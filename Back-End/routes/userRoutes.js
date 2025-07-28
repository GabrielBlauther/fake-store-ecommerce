const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController'); 

//middleware 
const verifyToken = require('../helpers/verify-token')

// Criar usuário (registrar)
router.post('/register', userController.register);
//login
router.post('/login', userController.login);

//verificar o usuario
router.get('/checkuser', userController.checkUser);

// Buscar todos os usuários
router.get('/', userController.getAllUsers);

// Buscar usuário por ID
router.get('/:id', userController.getUserById);

// Atualizar usuário
router.patch('/edit/:id',verifyToken, userController.editUser);

// Deletar usuário
router.delete('/:id', userController.deleteUser);



module.exports = router;
