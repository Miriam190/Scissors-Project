const request = require('supertest');
const { connect } = require('./database');
const UserSchema = require('../../schema/UserSchema');
const app = require('../../index');
require("dotenv").config();

describe('User Route', () => {
    let conn;
    beforeAll(async () => {
        conn = await connect();
    })

    afterEach(async () => {
        await conn.cleanup();
    })

    afterAll(async () => {
        await conn.disconnect();
    });
    it('create a user', async () => {
        const response = await request(app).post('/')
            .set('content-type', 'application/json')
            .send({
                username: 'testname',
                email: 'test@mail.com',
                password: 'test123',
                cPassword: 'test123',
            })
        expect(response.headers.location).toMatch("/login")
    });

    it('should throw error/not redirect login if user already exists ', async () => {
        await request(app).post('/')
            .set('content-type', 'application/json')
            .send({
                username: 'testname',
                email: 'test@mail.com',
                password: 'test123',
                cPassword: 'test123',
            })
        const response = await request(app).post('/')
            .set('content-type', 'application/json')
            .send({
                username: 'testname',
                email: 'test@mail.com',
                password: 'test123',
            })
            .redirects(0)

        expect(response.status).toBe(302);
        expect(response.headers.location).toMatch("/")
        expect(response.headers.location).not.toMatch("/login");
        expect(response.text).toContain("Found. Redirecting to /");
    });

    it('should login a user and redirect to home page, with set token in headers', async () => {
        const user = await UserSchema.create({
            username: 'testname',
            email: 'test@mail.com',
            password: 'test123',
            cPassword: 'test123',
        });
        const response = await request(app).post('/login')
            .set('content-type', 'application/json')
            .send({
                email: 'test@mail.com',
                password: 'test123',
            })
        const cookies = response.headers['set-cookie']

        expect(response.headers.location).toMatch("/api/shortify")
        expect(response.headers).toHaveProperty('set-cookie');

    });

    it('should throw error/not redirect homepage on incorrect login', async () => {
        const user = await UserSchema.create({
            username: 'testname',
            email: 'test@mail.com',
            password: 'test123',
            cPassword: 'test123',
        });
        const response = await request(app).post('/login')
            .set('content-type', 'application/json')
            .send({
                email: 'notexist@mail.com',
                password: 'notexistpass123',
            })
            .redirects(0)
        expect(response.status).toBe(302);
        expect(response.headers.location).toMatch("/login")
        expect(response.headers.location).not.toMatch("/api/shortify");
        expect(response.text).toContain("Found. Redirecting to /login");
    });
})