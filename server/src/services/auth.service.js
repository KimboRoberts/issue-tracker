const User = require('../models/user');
const AuthToken = require('../models/authToken');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { logger } = require('../log');

const register = async (user) => {
    logger.info('Called [register]; location: src/services/auth.service.js');

    await User.create(user);
    const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
    await AuthToken.create({
        username: user.username,
        token: token
    });
    return token;
}

const logout = async (username) => {
    logger.info('Called [logout]; location: src/services/auth.service.js');

    await AuthToken.deleteMany({username: username});
}

const login = async (userData) => {
    logger.info('Called [login]; location: src/services/auth.service.js');

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