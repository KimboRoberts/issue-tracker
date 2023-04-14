const authService = require('../services/auth.service');
const { logger } = require('../log');
const { isValidPassword } = require('../lib/utils');

const register = async(req, res, next) => {
    logger.info('Called [register]; location: src/controllers/auth.contoller.js');

    if (req.body.password && !isValidPassword(req.body.password)) {
        return res.status(400).send({errorMessage: "Invalid password"});
    }
    
    const user = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
    }
    try {
        token = await authService.register(user);
        res.status(201).send({token: token});
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
};

const logout = async(req, res, next) => {
    logger.info('Called [logout]; location: src/controllers/auth.contoller.js');

    await authService.logout(req.user.username);
    res.sendStatus(204);
}

const login = async (req, res, next) => {
    logger.info('Called [login]; location: src/controllers/auth.contoller.js');

    const userData = {
        username: req.body.username,
        password: req.body.password,
    }
    const token = await authService.login(userData);
    if (token == null) {
        return res.sendStatus(403);
    }
    res.send({token: token}); 
}

module.exports = {
    login,
    logout,
    register
}