const mongoose = require("mongoose");
const request = require("supertest");
const { app, server } = require('../index');

const User = require('../src/models/user');
const AuthToken = require('../src/models/authToken');
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
  });
  
afterAll(async () => {
    await User.deleteMany({});
    await AuthToken.deleteMany({});
    await mongoose.connection.close();
    server.close();
});

describe("First test", () => {
    it("Should pass the test", async () => {
        expect(true);
    })
});

// Register
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

        // store token for future tests
        token = res.body.token;

        expect(userQuery).toHaveLength(1);
        expect(userQuery[0]).toHaveProperty('username', 'kimroberts');
        expect(userQuery[0]).toHaveProperty('email', 'kim.roberts@live.co.uk');
        expect(userQuery[0]).toHaveProperty('password', 'Esaradev2!');

        expect(authQuery).toHaveLength(1);
        expect(authQuery[0]).toHaveProperty('token');

    })
});

describe("POST /auth/register - Empty username", () => {
    it("Should return HTTP 400 and body with errors array", async () => {
        const res = await request(app).post("/auth/register").send({
            email: "johnsmith@email.com",
            password: "Esaradev2!",
        });

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('errors');
        expect(res.body.errors).toHaveLength(1);
        expect(res.body.errors).toContainEqual({param: 'Username', message: 'Username not provided'});
    });
});

describe("POST /auth/register - username already exists", () => {
    it("Should return HTTP 409 and body with errors array", async () => {
        const res = await request(app).post("/auth/register").send({
            username: "kimroberts",
            email: "kimroberts@live.co.uk",
            password: "Esaradev2!",
        });

        expect(res.statusCode).toBe(409);
        expect(res.body).toHaveProperty('errors');
        expect(res.body.errors).toHaveLength(1);
        expect(res.body.errors).toContainEqual({param: 'Username', message: 'Username already exists'});
    });
});

describe("POST /auth/register - Invalid username", () => {
    it("Should return HTTP 400 and body with errors array", async () => {
        const res = await request(app).post("/auth/register").send({
            username: "k1!",
            email: "johnsmith@email.com",
            password: "Esaradev2!",
        });

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('errors');
        expect(res.body.errors).toHaveLength(2);
        expect(res.body.errors).toContainEqual({param: 'Username', message: 'Username must be between 8 and 16 characters'});
        expect(res.body.errors).toContainEqual({param: 'Username', message: 'Username must only contain alphanumeric characters'});
    });
});

describe("POST /auth/register - Empty email", () => {
    it("Should return HTTP 400 and body with errors array", async () => {
        const res = await request(app).post("/auth/register").send({
            username: "johndoee",
            password: "Esaradev2!",
        });

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('errors');
        expect(res.body.errors).toHaveLength(1);
        expect(res.body.errors).toContainEqual({param: 'email', message: 'email not provided'});
    });
});

describe("POST /auth/register - email already exists", () => {
    it("Should return HTTP 409 and body with errors array", async () => {
        const res = await request(app).post("/auth/register").send({
            username: "kimboroberts",
            email: "kim.roberts@live.co.uk",
            password: "Esaradev2!",
        });

        expect(res.statusCode).toBe(409);
        expect(res.body).toHaveProperty('errors');
        expect(res.body.errors).toHaveLength(1);
        expect(res.body.errors).toContainEqual({param: 'email', message: 'Account with this email already exists'});
    });
});

describe("POST /auth/register - Invalid email", () => {
    it("Should return HTTP 400 and body with errors array", async () => {
        const res = await request(app).post("/auth/register").send({
            username: "johndoee",
            email: "johnsmithemail.com",
            password: "Esaradev2!",
        });

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('errors');
        expect(res.body.errors).toHaveLength(1);
        expect(res.body.errors).toContainEqual({param: 'email', message: 'Invalid email'});
    });
});

describe("POST /auth/register - username and email already exist", () => {
    it("Should return HTTP 409 and body with errors array", async () => {
        const res = await request(app).post("/auth/register").send({
            username: "kimroberts",
            email: "kim.roberts@live.co.uk",
            password: "Esaradev2!",
        });

        expect(res.statusCode).toBe(409);
        expect(res.body).toHaveProperty('errors');
        expect(res.body.errors).toHaveLength(2);
        expect(res.body.errors).toContainEqual({param: 'Username', message: 'Username already exists'});
        expect(res.body.errors).toContainEqual({param: 'email', message: 'Account with this email already exists'});
    });
});

describe("POST /auth/register - Empty password", () => {
    it("Should return HTTP 400 and body with errors array", async () => {
        const res = await request(app).post("/auth/register").send({
            username: "johndoee",
            email: "johnsmith@email.com",
        });

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('errors');
        expect(res.body.errors).toHaveLength(1);
        expect(res.body.errors).toContainEqual({param: 'Password', message: 'Password not provided'});
    });
});

describe("POST /auth/register - invalid password", () => {
    it("Should return HTTP 400 and body with errors array", async () => {
        const res = await request(app).post("/auth/register").send({
            username: "johndoee",
            email: "johndoe@live.co.uk",
            password: "badpassword!",
        });

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('errors');
        expect(res.body.errors).toHaveLength(1);
        expect(res.body.errors).toContainEqual({param: 'Password', message: 'Invalid password'});
    });
});

// Logout
describe("POST /auth/logout", () => {
    it("Should return HTTP 204", async () => {
        const res = await request(app).post("/auth/logout")
        .set('Authorization', `Bearer ${token}`)
        .send();

        const authQuery = await AuthToken.find({username: "kimroberts"});

        expect(res.statusCode).toBe(204);
        expect(authQuery).toHaveLength(0);
    });
});

describe("POST /auth/logout - not currently logged in", () => {
    it("Should return HTTP 403", async () => {
        const res = await request(app).post("/auth/logout")
        .set('Authorization', `Bearer ${token}`)
        .send();

        expect(res.statusCode).toBe(403);
    });
});

describe("POST /auth/logout - Invalid credentials", () => {
    it("Should return HTTP 401", async () => {
        const res = await request(app).post("/auth/logout")
        .set('Authorization', 'testtesttest')
        .send();

        expect(res.statusCode).toBe(401);
    });
});

// Login
describe("POST /auth/login - Incorrect username", () => {
    it("Should return HTTP 403", async () => {
        const res = await request(app).post("/auth/login").send({
            username: "wrongname",
            password: "Esaradev2!"
        });

        expect(res.statusCode).toBe(403);
    });
});

describe("POST /auth/login - Incorrect password", () => {
    it("Should return HTTP 403", async () => {
        const res = await request(app).post("/auth/login").send({
            username: "kimroberts",
            password: "Esaradev1!"
        });

        expect(res.statusCode).toBe(403);
    });
});

describe("POST /auth/login", () => {
    it("Should return HTTP 201", async () => {
        const res = await request(app).post("/auth/login").send({
            username: "kimroberts",
            password: "Esaradev2!"
        });

        const authQuery = await AuthToken.find({username: "kimroberts"});

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('token')

        expect(authQuery).toHaveLength(1);
        expect(authQuery[0]).toHaveProperty('token');
    });
});




