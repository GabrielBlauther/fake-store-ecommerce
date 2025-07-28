const UserModel = require('../models/user')
const bcrypt = require('bcrypt');
//helpers
const createUserToken = require('../helpers/create-user-token')
const getToken = require('../helpers/get-token')
const getUserByToken = require('../helpers/get-user-by-token') 
const jwt = require('jsonwebtoken')

module.exports = class userController{
   //Registrar usuario 
    static async register (req, res){
        try {
            const userModel = new UserModel();
            const userData = req.body;

            // Validar campos obrigatórios
            if (!userData.name || !userData.email || !userData.password || 
                !userData.confirmPassword || !userData.phone) {
                return res.status(400).json({ 
                    error: 'Todos os campos são obrigatórios' 
                });
            }

            // Verificar se senhas coincidem
            if(userData.password !== userData.confirmPassword){
                return res.status(422).json({
                    message: "A senha e a confirmação de senha precisam ser iguais!"
                });
            }

            // Verificar se email já existe
            const userExists = await userModel.findByEmail(userData.email);
            if (userExists) {
                return res.status(422).json({
                    message: 'Email já cadastrado'
                });
            }

            // Criptografia da senha
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
            userData.password = hashedPassword;

            // Remover confirmPassword antes de salvar
            delete userData.confirmPassword;
            // Criar usuário no banco
            const result = await userModel.create(userData);

            // Criar objeto com dados necessários
            const userForToken = {
                _id: result.insertedId,
                name: userData.name,
                email: userData.email,
                phone: userData.phone
            };

            await createUserToken(userForToken, req, res);
            
        } catch (error) {
            res.status(500).json({ 
                error: 'Erro ao criar usuário',
                details: error.message 
            });
        }
    }

    //Login de usuario
    static async login(req, res) {
        try {
            const userModel = new UserModel();
            const { email, password } = req.body;
            
            // Validar campos obrigatórios
            if (!email || !password) {
                return res.status(400).json({ 
                    error: 'Email e senha são obrigatórios' 
                });
            }
            
            // Buscar usuário por email
            const user = await userModel.findByEmail(email);
            
            if (!user) {
                return res.status(404).json({ error: 'Usuário não encontrado' });
            }
            
            // Comparar senha
            const isValidPassword = await bcrypt.compare(password, user.password);
            
            if (!isValidPassword) {
                return res.status(401).json({ error: 'Senha incorreta' });
            }

            // Login bem-sucedido
            await createUserToken(user, req, res);
    
        } catch (error) {
            res.status(500).json({ 
                error: 'Erro no login',
                details: error.message 
            });
        }

    }
    // Token 
    static async checkUser(req, res) {

        try {
            let currentUser;
            
            if (req.headers.authorization) {
                const token = getToken(req);
                const decoded = jwt.verify(token, 'nossosecret');
                const userModel = new UserModel();
                currentUser = await userModel.findById(decoded.id);
            } else {
                currentUser = null;
            }

            res.json(currentUser);
            
        } catch (error) {
            console.log('Erro:', error);
            res.status(500).json({ 
                error: 'Erro ao verificar usuário',
                details: error.message 
            });
        }
    }
    //buscar todos os usuarios
    static async getAllUsers(req, res){
        try{
            const userModel = new UserModel();
            const users = await userModel.findAll();
            res.json(users);
        }catch (error){
            res.status(500).json({
                error: 'Erro ao buscar usuários',
                details: error.message
            });
        }
    }
    //buscar usuario por id
    static async getUserById(req, res){
        try{
            
            const userModel = new UserModel();
            const user = await userModel.findById(req.params.id);
            if (!user){
                return res.status(404).json({error: 'Usuário não encontrado'}); 
            } 
            res.json(user); 
        }catch (error){
            res.status(500).json({
                error: "Erro ao buscar usuario",
                details: error.message
            })
        }
    }
    //editar usuario
    static async editUser(req, res) {
        try {
            const userModel = new UserModel();
            const id = req.params.id;
            
            const token = getToken(req);
            const currentUser = await getUserByToken(token);

            const { name, email, phone, password, confirmPassword } = req.body;
            
            // Buscar usuário atual
            const user = await userModel.findById(id);
            if (!user) {
                return res.status(404).json({ error: 'Usuário não encontrado' });
            }
            
            // Verificar senhas se fornecidas
            if (password && password !== confirmPassword) {
                return res.status(422).json({
                    message: "A senha e a confirmação de senha precisam ser iguais!"
                });
            } else if (password === confirmPassword && password != null){

                //criação de senha
                const salt = await bcrypt.hash(password, salt)

                user.password = hashedPassword
            }
            try {
                await User.findOneAndUpdate(
                    {_id: user._id},
                    {$set: user},
                    {new: true}
                )

                res.status(200).json({
                    
                })
            } catch (error) {
                
            }
            
            // Preparar dados para atualização
            const updateData = {};
            if (name) updateData.name = name;
            if (email) updateData.email = email;
            if (phone) updateData.phone = phone;
            if (password) {
                updateData.password = await bcrypt.hash(password, 10);
            }
            
        // Atualizar usuário
        const result = await userModel.updateById(id, updateData);
        
        if (result.matchedCount === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }
        
        res.json({ message: 'Usuário atualizado com sucesso' });
        
    } catch (error) {
        res.status(500).json({ 
            error: 'Erro ao atualizar usuário',
            details: error.message 
        });
    }
}

    //deletar usuarios
    static async deleteUser(req, res) {
        try {
            const userModel = new UserModel();
            const result = await userModel.deleteById(req.params.id);
            
            if (result.deletedCount === 0) {
                return res.status(404).json({ error: 'Usuário não encontrado' });
            }
            
            res.json({ message: 'Usuário deletado com sucesso' });
        } catch (error) {
            res.status(500).json({ 
                error: 'Erro ao deletar usuário',
                details: error.message 
            });
        }
    }
}
