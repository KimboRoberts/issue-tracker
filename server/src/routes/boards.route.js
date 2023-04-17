const express = require('express');
const router = express.Router();
const boardsController = require('../controllers/boards.controller');
const { authorise } = require('../middlewares/auth.middleware');
const { validateCreateBoard } = require('../middlewares/boards.middleware');

router.post('/', [authorise, validateCreateBoard] ,boardsController.create);

module.exports = router;