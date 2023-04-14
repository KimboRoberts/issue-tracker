const mongoose = require('mongoose');

const boardSchema = new mongoose.Schema({
    username: String,
    board_name: String,
    creation_date: Date,
    columns: [String],
});

module.exports = mongoose.model('Board', boardSchema);