const User = require('../models/user');
const jwt = require('jsonwebtoken');
const AuthToken = require('../models/authToken');
const { logger } = require('../log');
const { validateUsername, validateEmail, validatePassword, usernameIsUnique, emailIsUnique } = require('../lib/validation');

async function validateRegister(req, res, next) {
    logger.info('Called [validateRegister]; location: src/middlewares/auth.middleware.js');

    const { username, email, password } = req.body;

    errors = []

    if (!await usernameIsUnique(username)) {
        errors.push({param: 'Username', message: 'Username already exists'});
    }

    if (!await emailIsUnique(email)) {
        errors.push({param: 'email', message: 'Account with this email already exists'});
    }

    // if conflicts, return error
    if (errors.length > 0) {
        return res.status(409).send({
            errors: errors
        });
    } 

    errors = [
        ...errors,
        ...await validateUsername(username),
        ...await validateEmail(email),
        ...validatePassword(password)
    ]

    // if validation errors, return error
    if (errors.length > 0) {
        return res.status(400).send({
            errors: errors
        });
    } 

    next();
}

async function authorise(req, res, next) {
    logger.info('Called [authorise]; location: src/middlewares/auth.middleware.js');

    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) return res.sendStatus(401);

    // decode token; set user
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async(err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
    });

    // check if user logged in
    if (!(await AuthToken.findOne({username: req.user.username}))) {
        return res.sendStatus(403);
    }
    next();
}

module.exports = {
    validateRegister,
    authorise,
}