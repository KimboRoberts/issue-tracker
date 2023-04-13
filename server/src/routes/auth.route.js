const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { validateRegister, authorise } = require('../middlewares/auth.middleware');

router.post('/register', validateRegister, authController.register);
router.post('/logout', authorise, authController.logout);
router.post('/login', authController.login);

module.exports = router;