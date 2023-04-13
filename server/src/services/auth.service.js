const User = require('../models/user');
const AuthToken = require('../models/authToken');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const register = async (user) => {
    await User.create(user);
    const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
    await AuthToken.create({
        username: user.username,
        token: token
    });
    return token;
}

const logout = async (username) => {
    await AuthToken.deleteMany({username: username});
}

const login = async (userData) => {
    const result = await User.findOne({username: userData.username});
    if (!result || result.password !== userData.password) return null;
  
    const authRecord = await AuthToken.findOne({username: userData.username})
    if (authRecord) return authRecord.token;
    
    const token = jwt.sign(userData, process.env.ACCESS_TOKEN_SECRET);
    await AuthToken.create({username: userData.username, token: token});
    return token;
}

module.exports = {
    login,
    logout,
    register
}