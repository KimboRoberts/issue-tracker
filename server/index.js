const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const version = require('./src/config/version');
const ticketsRouter = require('./src/route/tickets.route');

app.get('/health-check', (req, res) => {
    res.json({'message:': `App running [v${version}]`}).status(200);
});

app.use('/tickets', ticketsRouter);

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});