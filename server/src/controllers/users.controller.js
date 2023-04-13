const usersService = require('../services/users.service');

const getAllUsers = async (req, res, next) => {
    const all = await usersService.getAllUsers();
    res.json(all);
};

module.exports = {
    getAllUsers,
}