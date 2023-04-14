const mongoose = require("mongoose");
const request = require("supertest");
const jwt = require('jsonwebtoken');
const { app, server } = require('../index');

const User = require('../src/models/user');
const AuthToken = require('../src/models/authToken');
const Board = require('../src/models/boards.model');
require("dotenv").config();

let token;

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
        username: "kimroberts",
        email: "kim.roberts@live.co.uk",
        password: "Esaradev4!"
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

describe("First test", () => {
    it("Should pass the test", async () => {
        expect(true);
    })
});

describe("POST /boards - No auth token provided", () => {
    it("Should return HTTP status code 401", async () => {
        const res = await request(app).post("/boards").send({
            board_name: "Issue Tracker Project"
        });

        expect(res.statusCode).toBe(401);
    })
});

describe("POST /boards - Invalid auth token provided", () => {
    it("Should return HTTP status code 403", async () => {
        const res = await request(app).post("/boards")
        .set('Authorization', 'Bearer testtesttest')
        .send({
            board_name: "Issue Tracker Project"
        });

        expect(res.statusCode).toBe(403);
    })
});


describe("POST /boards - No board name provided", () => {
    it("Should return HTTP status code 400 and body with errors array", async () => {
        const res = await request(app).post("/boards")
        .set('Authorization', `Bearer ${token}`)
        .send();

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('errors');
        expect(res.body.errors).toHaveLength(1);
        expect(res.body.errors).toContainEqual({param: 'Board name', message: 'Board name not provided'});
    });
});

describe("POST /boards - Invalid board name: too  (>30 chars)", () => {
    it("Should return HTTP status code 400 and body with errors array", async () => {
        const res = await request(app).post("/boards")
        .set('Authorization', `Bearer ${token}`).send({
            board_name: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" 
        });

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('errors');
        expect(res.body.errors).toHaveLength(1);
        expect(res.body.errors).toContainEqual({param: 'Board name', message: 'Board name must be less than or equal to 30 characters'});
    });
});

describe("POST /boards", () => {
    it("Should return HTTP status 201. New board should be present in database", async () => {
        const res = await request(app).post("/boards")
        .set('Authorization', `Bearer ${token}`)
        .send({
            board_name: "Issue Tracker Project"
        });

        const boardQuery = await Board.find({username: "kimroberts", board_name: "Issue Tracker Project"});

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('board_id');
        expect(boardQuery).toHaveLength(1);        
    })
});

describe("POST /boards", () => {
    it("Should return HTTP status 409 and body with errors array", async () => {
        const res = await request(app).post("/boards")
        .set('Authorization', `Bearer ${token}`)
        .send({
            board_name: "Issue Tracker Project"
        });

        const boardQuery = await Board.find({username: "kimroberts", board_name: "Issue Tracker Project"});

        expect(res.statusCode).toBe(409);
        expect(res.body).toHaveProperty('errors');
        expect(res.body.errors).toHaveLength(1);
        expect(res.body.errors).toContainEqual({param: "Board name", message: "Board with that name already exists in your account"});
        expect(boardQuery).toHaveLength(1);        
    })
});
  
afterAll(async () => {
    await mongoose.connection.close();
    server.close();
});