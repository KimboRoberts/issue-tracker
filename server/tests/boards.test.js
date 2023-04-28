const mongoose = require('mongoose');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const { app, server } = require('../index');
require('dotenv').config();

const User = require('../src/models/user');
const AuthToken = require('../src/models/authToken');
const Board = require('../src/models/boards.model');

let token;
let board_id;

beforeAll(async () => {
    await mongoose.connect(process.env.DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: process.env.DB_NAME,
    });
    await User.deleteMany({});
    await AuthToken.deleteMany({});
    await Board.deleteMany({});

    const user = await User.create({
        username: 'kimroberts',
        email: 'kim.roberts@live.co.uk',
        password: 'Esaradev4!'
    });

    token = jwt.sign({username: user.username, email: user.email, password: user.password}, process.env.ACCESS_TOKEN_SECRET);

    await AuthToken.create({token: token, username: user.username});
  });

afterAll(async () => {
    await User.deleteMany({});
    await AuthToken.deleteMany({});
    await Board.deleteMany({});
    await mongoose.connection.close();
    server.close();
});

describe('First test', () => {
    it('Should pass the test', async () => {
        expect(true);
    })
});

// Create board

describe('POST /boards - No auth token provided', () => {
    it('Should return HTTP status code 401', async () => {
        const res = await request(app).post('/boards').send({
            board_name: 'Issue Tracker Project'
        });

        expect(res.statusCode).toBe(401);
    })
});

describe('POST /boards - Invalid auth token provided', () => {
    it('Should return HTTP status code 403', async () => {
        const res = await request(app).post('/boards')
        .set('Authorization', 'Bearer testtesttest')
        .send({
            board_name: 'Issue Tracker Project'
        });

        expect(res.statusCode).toBe(401);
    })
});


describe('POST /boards - No board name provided', () => {
    it('Should return HTTP status code 400 and body with errors array', async () => {
        const res = await request(app).post('/boards')
        .set('Authorization', `Bearer ${token}`)
        .send();

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('errors');
        expect(res.body.errors).toHaveLength(1);
        expect(res.body.errors).toContainEqual({param: 'Board name', message: 'Board name not provided'});
    });
});

describe('POST /boards - Invalid board name: too  (>30 chars)', () => {
    it('Should return HTTP status code 400 and body with errors array', async () => {
        const res = await request(app).post('/boards')
        .set('Authorization', `Bearer ${token}`).send({
            board_name: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' 
        });

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('errors');
        expect(res.body.errors).toHaveLength(1);
        expect(res.body.errors).toContainEqual({param: 'Board name', message: 'Board name must be less than or equal to 30 characters'});
    });
});

describe('POST /boards', () => {
    it('Should return HTTP status 201. New board should be present in database', async () => {
        const res = await request(app).post('/boards')
        .set('Authorization', `Bearer ${token}`)
        .send({
            board_name: 'Issue Tracker Project'
        });

        const boardQuery = await Board.find({username: 'kimroberts', board_name: 'Issue Tracker Project'});

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('board_id');
        expect(boardQuery).toHaveLength(1);
        
        board_id = res.body.board_id;
    })
});

describe('POST /boards - board namealready exists for user', () => {
    it('Should return HTTP status 409 and body with errors array', async () => {
        const res = await request(app).post('/boards')
        .set('Authorization', `Bearer ${token}`)
        .send({
            board_name: 'Issue Tracker Project'
        });

        const boardQuery = await Board.find({username: 'kimroberts', board_name: 'Issue Tracker Project'});

        expect(res.statusCode).toBe(409);
        expect(res.body).toHaveProperty('errors');
        expect(res.body.errors).toHaveLength(1);
        expect(res.body.errors).toContainEqual({param: 'Board name', message: 'Board with that name already exists in your account'});
        expect(boardQuery).toHaveLength(1);        
    })
});

// Get board by ID

describe('GET /boards/:id - No auth token provided', () => {
    it('Should return HTTP 401', async () => {
        const res = await request (app).get(`/boards/${board_id}`);
        expect(res.statusCode).toBe(401);
    });
});

describe('GET /boards/:id - Invalid auth token provided', () => {
    it('Should return HTTP 401', async () => {
        const res = await request (app).get(`/boards/${board_id}`)
            .set('Authorization', 'testtesttest').send();
        
        expect(res.statusCode).toBe(401);
    });
});

describe('GET /boards/:id - No board found', () => {
    it('Should return HTTP 404', async () => {
        const res = await request (app).get('/boards/1234')
            .set('Authorization', `Bearer ${token}`).send();
        
        expect(res.statusCode).toBe(404);
    });
});

describe('GET /boards/:id', () => {
    it('Should return HTTP 200 and body with board data', async () => {
        const res = await request (app).get(`/boards/${board_id}`)
            .set('Authorization', `Bearer ${token}`).send();
        
        expect(res.statusCode).toBe(200);
        expect(res.body._id).toBe(board_id);
        expect(res.body.username).toBe('kimroberts');
        expect(res.body.board_name).toBe('Issue Tracker Project');
        expect(res.body.columns).toStrictEqual([]);
        expect(res.body).toHaveProperty('creation_date');
    });
});

  
afterAll(async () => {
    await mongoose.connection.close();
    server.close();
});