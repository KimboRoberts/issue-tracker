const { boardNameIsUnique, validateBoardName } = require('../lib/validation');
const { logger } = require('../log');

const validateCreateBoard = async(req, res, next) => {
    logger.info('Called [validateCreateBoard]; location: src/middlewares/boards.middleware.js');
    const { board_name } = req.body;

    errors = validateBoardName(board_name);

    if (errors.length > 0) {
        return res.status(400).send({
            errors: errors
        });
    }

    if (!await boardNameIsUnique(board_name, req.user.username)) {
        return res.status(409).send({
            errors: [
                {param: "Board name", message: "Board with that name already exists in your account"}
            ]
        });
    }
    next();
}

module.exports = {
    validateCreateBoard
}