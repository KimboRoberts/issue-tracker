const User = require('../models/user');
const jwt = require('jsonwebtoken');
const AuthToken = require('../models/authToken');

async function validateRegister(req, res, next) {

    conflicts = [];
    // check if username already exists
    if (await User.findOne({username: req.body.username}).exec()) {
        conflicts.push('username');
    }

    // check if username already exists
    if (await User.findOne({email: req.body.email}).exec()) {
        conflicts.push('email');
    }

    // if conflicts, return error
    if (conflicts.length > 0) {
        return res.status(409).send(conflicts);
    } 

    next();
}

async function authorise(req, res, next) {
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