const Board = require('../models/boards.model');
const { logger } = require('../log');

const create = async (boardData) => {
    logger.info('Called [create]; location: src/services/boards.service.js');
    
    const board = await Board.create({
        board_name: boardData.board_name,
        username: boardData.username,
        columns: [],
        creation_date: new Date().getTime()
    });
    return board.id;
}
module.exports = {
    create
}