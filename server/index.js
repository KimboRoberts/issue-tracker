const express = require('express');
const app = express();
const port = process.env.PORT || 3001;
const User = require('./src/models/user');
const AuthToken = require('./src/models/authToken');
const version = require('./src/config/version');
const ticketsRouter = require('./src/routes/tickets.route');
const usersRouter = require('./src/routes/users.route');
const authRouter = require('./src/routes/auth.route');
const { dbConnect } = require('./src/lib/mongoDB');
const cors = require('cors');

dbConnect();

app.use(cors());
app.use(express.json())

app.get('/health-check', (req, res) => {
    res.json({'message:': `App running [v${version}]`}).status(200);
});

app.delete('/reset', async (req, res) => {
    const useRres = await User.deleteMany({});
    const authRes = await AuthToken.deleteMany({});
    console.log(`DELETED ${useRres.deletedCount} User records\nDELETED ${authRes.deletedCount} Auth records`)
    res.sendStatus(204);
});

app.use('/tickets', ticketsRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});