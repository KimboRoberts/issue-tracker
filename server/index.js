const express = require('express');
const app = express();
const cors = require('cors');
const winston = require('winston');
const expressWinston = require('express-winston');
const port = process.env.PORT || 3001;

const usersRouter = require('./src/routes/users.route');
const authRouter = require('./src/routes/auth.route');

const User = require('./src/models/user');
const AuthToken = require('./src/models/authToken');
const { logger, combinedFormat } = require('./src/log');
const { dbConnect } = require('./src/lib/mongoDB');

dbConnect();

app.use(cors());
app.use(express.json())

app.use(expressWinston.logger({
    transports: [
      new winston.transports.Console()
    ],
    format: combinedFormat,
    meta: false,
    msg: "HTTP {{req.method}} {{req.url}}",
    expressFormat: true,
    colorize: false,
    ignoreRoute: function (req, res) { return false; }
  }));

app.get('/health-check', (req, res) => {
    res.json({'message:': `App running [v${process.env.VERSION}]`}).status(200);
});

app.delete('/reset', async (req, res) => {
    const useRres = await User.deleteMany({});
    const authRes = await AuthToken.deleteMany({});
    console.log(`DELETED ${useRres.deletedCount} User records\nDELETED ${authRes.deletedCount} Auth records`)
    res.sendStatus(204);
});

app.use('/users', usersRouter);
app.use('/auth', authRouter);

const server = app.listen(port, () => {
    logger.info(`Server is listening on port ${port}`);
});

module.exports = {
    app,
    server
}