const jwt = require('jsonwebtoken');
const getToken = require ('../helpers/get-token')

//middleware
const checkToken = (req, res, next) =>{

    if(!req.headers.authorization){
        return res.status(401).json({message: "Acesso negado!"})
    }

    const token = getToken(req)

    if(!token){
        return res.status(401).json({message: "Acesso negado!"})
    }

    try {

        const verified = jwt.verify(token, 'nossosecret')
        req.user = verified
        next()
        
    } catch (error) {
        return res.status(400).json({message: "Token inválido!"})
    }
}

module.exports = checkToken 