const User = require('../models/user');
const Board = require('../models/boards.model');
const { logger } = require('../log');
const { isEmail, isAlphanumeric, isLength, isStrongPassword } = require('validator');

const validateUsername = (username) => {
    logger.info('Called [validateUsername]; location: src/lib/validation.js');

    errors = [];

    // Check if exists
    if (!username) {
        errors.push({
            param: 'Username',
            message: 'Username not provided'
        });
        return errors;
    }

    if (!isLength(username, {min: 8, max: 16})) {
        errors.push({
            param: 'Username',
            message: 'Username must be between 8 and 16 characters'
        }); 
    }

    // Check for is alphanumeric
    if (!isAlphanumeric(username)) {
        errors.push({
            param: 'Username',
            message: 'Username must only contain alphanumeric characters'
        });
    }

    return errors;
}

const validateEmail = (email) => {
    logger.info('Called [validateEmail]; location: src/lib/validation.js');

    errors = [];

    // Check if exists
    if (!email) {
        errors.push({
            param: 'email',
            message: 'email not provided'
        });
        return errors;
    }

    // Check email format
    if (!isEmail(email)) {
        errors.push({
            param: 'email',
            message: 'Invalid email'
        });
    }

    return errors;
}

const validatePassword = (password) => {
    logger.info('Called [validatePassword]; location: src/lib/validation.js');

    errors = [];

    // Check if exists
    if (!password) {
        errors.push({
            param: 'Password',
            message: 'Password not provided'
        });
        return errors;
    }

    // Check email format
    if (!isStrongPassword(password, {
        minLength: 8, 
        minLowerCase: 1, 
        minUpperCase: 1, 
        minNumbers: 1, 
        minSymbols: 1, 
        returnScore: false
    }))  
    {
        errors.push({
            param: 'Password',
            message: 'Invalid password'
        });
    }

    return errors;
}

const validateBoardName = (boardName) => {
    logger.info('Called [validateBoardName]; location: src/lib/validation.js');

    errors = [];

    // Check if exists
    if (!boardName) {
        errors.push({
            param: 'Board name',
            message: 'Board name not provided'
        });
        return errors;
    }

    // Check length
    if (!isLength(boardName, {min: 1, max: 30})) {
        errors.push({
            param: 'Board name',
            message: 'Board name must be less than or equal to 30 characters'
        }); 
    }

    return errors;
}

const usernameIsUnique = async (username) => {
    logger.info('Called [usernameIsUnique]; location: src/lib/validation.js');

    if (await User.findOne({username: username}).exec()) {
        return false;
    }
    return true;
}

const emailIsUnique = async (email) => {
    logger.info('Called [emailIsUnique]; location: src/lib/validation.js');

    if (await User.findOne({email: email}).exec()) {
        return false;
    }
    return true;
}

const boardNameIsUnique = async (boardName, username) => {
    logger.info('Called [boardNameIsUnique]; location: src/lib/validation.js');

    if (await Board.findOne({username: username, board_name: boardName}).exec()) {
        console.log('returning false');
        return false;
    }
    return true;
}

module.exports = {
    validateUsername,
    validateEmail,
    validatePassword,
    usernameIsUnique,
    emailIsUnique,
    boardNameIsUnique,
    validateBoardName
}

