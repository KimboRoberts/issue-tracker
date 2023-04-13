const mongoose = require("mongoose");
const request = require("supertest");
const { app, server } = require('../index');

const User = require('../src/models/user');
const AuthToken = require('../src/models/authToken');
require("dotenv").config();

beforeAll(async () => {
    await mongoose.connect(process.env.DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: process.env.DB_NAME,
    });
    await User.deleteMany({});
    await AuthToken.deleteMany({});
  });
  
  afterAll(async () => {
    await mongoose.connection.close();
    server.close();
  });

describe("First test", () => {
    it("Should pass the test", async () => {
        expect(true);
    })
});

describe("POST /auth/register", () => {
    it("Should return HTTP 201 and an auth token. User and auth token should be present in database", async () => {
        const res = await request(app).post("/auth/register").send({
            username: "kimroberts",
            email: "kim.roberts@live.co.uk",
            password: "Esaradev2!",
        });

        const userQuery = await User.find({username: "kimroberts"});
        const authQuery = await AuthToken.find({username: "kimroberts"});

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('token')

        expect(userQuery).toHaveLength(1);
        expect(userQuery[0]).toHaveProperty('username', 'kimroberts');
        expect(userQuery[0]).toHaveProperty('email', 'kim.roberts@live.co.uk');
        expect(userQuery[0]).toHaveProperty('password', 'Esaradev2!');

        expect(authQuery).toHaveLength(1);
        expect(authQuery[0]).toHaveProperty('token');

    })
});