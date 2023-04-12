const { response } = require('express');
const ticketService = require('../services/tickets.service');

const get = async (req, res, next) => {
    const response = ticketService.get()
    res.json(response);
};

module.exports = {
    get
}