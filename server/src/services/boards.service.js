const Board = require('../models/boards.model');
const mongoose = require('mongoose');
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

const get = async (board_id) => {
    logger.info('Called [get]; location: src/services/boards.service.js');
    let board;
    try {
        const id = new mongoose.Types.ObjectId(board_id);
        board = await Board.findById(id);
    } catch {
        board = null
    }
    return board;
}

module.exports = {
    create,
    get
}