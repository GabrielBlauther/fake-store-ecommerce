const jwt = require('jsonwebtoken');
const UserModel = require("../models/user");

const getUserByToken = async (token) => {
    if (!token) {
        return null;
    }

    try {
        const decoded = jwt.verify(token, 'nossosecret');
        const userModel = new UserModel();
        const user = await userModel.findById(decoded.id);
        return user;
    } catch (error) {
        return null;
    }
};

module.exports = getUserByToken;
