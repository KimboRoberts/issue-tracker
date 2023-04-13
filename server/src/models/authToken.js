const mongoose = require('mongoose');

const authTokenSchema = new mongoose.Schema({
    username: String,
    token: String,
});

module.exports = mongoose.model('AuthToken', authTokenSchema);