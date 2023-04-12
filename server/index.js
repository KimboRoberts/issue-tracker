const express = require('express');
const app = express();
const port = process.env.PORT || 3001;
const version = require('./src/config/version');
const ticketsRouter = require('./src/routes/tickets.route');
const usersRouter = require('./src/routes/users.route');
const { dbConnect } = require('./src/lib/mongoDB');
const cors = require('cors');

dbConnect();

app.get('/health-check', (req, res) => {
    res.json({'message:': `App running [v${version}]`}).status(200);
});

app.use(cors());
app.use('/tickets', ticketsRouter);
app.use('/users', usersRouter);

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});