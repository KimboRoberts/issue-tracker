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

const get = async (req, res, next) => {
    logger.info('Called [get]; location: src/controllers/boards.controller.js');

    const board = await boardsService.get(req.params.id)
    if (!board) {
        return res.sendStatus(404);
    }
    res.status(200).send(board);
}

const getAllByUsername = async (req, res, next) => {

    logger.info('Called [getAllByUsername]; location: src/controllers/boards.controller.js');

    const boards = await boardsService.getAllByUsername(req.user.username);

    return res.status(200).send(boards);

}

module.exports = {
    create,
    get,
    getAllByUsername,
}