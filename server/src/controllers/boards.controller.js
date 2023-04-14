const boardsService = require('../services/boards.service');
const { logger } = require('../log');

const create = async (req, res, next) => {
    logger.info('Called [create]; location: src/controllers/boards.controller.js');

    const boardId = await boardsService.create({
        board_name: req.body.board_name,
        username: req.user.username
    });
    res.status(201).send({
        board_id: boardId
    });
}

module.exports = {
    create
}