require("dotenv").config();
const request = require('supertest');
const app = require('../../index');
const { connect } = require('./database');
const UserSchema = require('../../schema/UserSchema');
const UrlSchema = require('../../schema/UrlSchema');
const { nanoid } = require("nanoid");


describe('Url Route', () => {
    let conn;
    let loginResponse;

    beforeAll(async () => {
        conn = await connect();

        await UserSchema.create({ username: 'tonia', email: 'tonia@mail.com', password: '123456', cPassword: '123456' });

        const login = await request(app).post('/login')
            .send({
                email: 'tonia@mail.com',
                password: '123456'
            })
        loginResponse = login.headers['set-cookie'];
    });

    afterEach(async () => {
        await conn.cleanup()
    })

    afterAll(async () => {
        await conn.disconnect();
    })

    it('generate random shortened url', async () => {

        const response = await request(app)
            .post('/api/shortify')
            .set('content-type', 'application/json')
            .send({
                origUrl: "https://github.com/AnthoniaNwanya"
            })
            .set("Cookie", loginResponse)
            .redirects(0)

        expect(response.status).toBe(200);
        expect(response.text).toContain('result');
        expect(response.text).toContain("<p>your generated link is:</p>");
        expect(response.text).toContain(" <span id=\"download-action\">Download QR CODE</span>");

    });

    it('generate custom shortened url', async () => {

        await UserSchema.create({ username: 'tonia', email: 'tonia@mail.com', password: '123456', cPassword: '123456'});
        const login = await request(app).post('/login')
            .send({
                email: 'tonia@mail.com',
                password: '123456',
            })
        loginResponse = login.headers['set-cookie'];
        const response = await request(app)
            .post('/api/shortify')
            .set('content-type', 'application/json')
            .set('Cookie', loginResponse)
            .send({
                origUrl: "https://github.com/AnthoniaNwanya",
                customId: "tonia"
            });

        expect(response.status).toBe(200);
        expect(response.text).toContain('result');
        expect(response.text).toContain("<p>your generated link is:</p>");
        expect(response.text).toContain(" <span id=\"download-action\">Download QR CODE</span>");
    });

    it('should return "URL already exists" when already existing url is passed', async () => {

        await UserSchema.create({ username: 'tonia', email: 'tonia@mail.com', password: '123456', cPassword: '123456' });
        const login = await request(app).post('/login')
            .send({
                email: 'tonia@mail.com',
                password: '123456'
            })
        loginResponse = login.headers['set-cookie'];
        await request(app)
            .post('/api/shortify')
            .set('content-type', 'application/json')
            .set('Cookie', loginResponse)
            .send({
                origUrl: "https://github.com/AnthoniaNwanya",
                customId: "tonia"
            });
        const response = await request(app)
            .post('/api/shortify')
            .set('content-type', 'application/json')
            .set('Cookie', loginResponse)
            .send({
                origUrl: "https://github.com/AnthoniaNwanya",

            })
            .redirects(0)

        expect(response.statusCode).toBe(302);
        expect(response.text).toContain("Found. Redirecting to /api/shortify/history");
        expect(response.headers.location).toMatch('/api/shortify/history');

    });


    it('should throw error when URL is invalid', async () => {

        await UserSchema.create({ username: 'tonia', email: 'tonia@mail.com', password: '123456', cPassword: '123456'});
        const login = await request(app).post('/login')
            .send({
                email: 'tonia@mail.com',
                password: '123456'
            })
        loginResponse = login.headers['set-cookie'];
        const response = await request(app)
            .post('/api/shortify')
            .set('content-type', 'application/json')
            .set('Cookie', loginResponse)
            .send({
                origUrl: "www.anyrtwee.com",
                customId: "tonia"
            })
            .redirects(0)
            console.log(response.text)
        expect(response.statusCode).toBe(302);
        expect(response.text).toContain('Found. Redirecting to /api/shortify');
        expect(response.body.data).not.toBe('http://localhost:8000/tonia');

    });

    it('return url history of user', async () => {
        const user = await UserSchema.create({ username: 'tonia', email: 'tonia@mail.com', password: '123456', cPassword: '123456' });
        const BASE = process.env.BASE;
        const urlId = nanoid(5);
        await UrlSchema.create({
            urlId: urlId,
            origUrl: "https://github.com/AnthoniaNwanya",
            shortUrl: (`${BASE}/${urlId}`),
            User: user.email,
            createdAt: new Date(),
        });
        await UrlSchema.create({
            urlId: urlId,
            origUrl: "https://cloud.mongodb.com",
            shortUrl: (`${BASE}/${urlId}`),
            User: user.email,
            createdAt: new Date(),
        });
        const login = await request(app).post('/login')
            .send({
                email: 'tonia@mail.com',
                password: '123456'
            })
        loginResponse = login.headers['set-cookie'];

        const response = await request(app)
            .get('/api/shortify/history')
            .set('Cookie', loginResponse)


        expect(response.status).toBe(200);
        expect(response.text).toContain("<i class=\"bx bx-folder-open icon\">URL HISTORY </i>");
        expect(response.text).toContain("<th scope=\"col\">Original URL</th>");
        expect(response.text).toContain("<th scope=\"col\">Short URL</th>");
        expect(response.text).toContain("<th scope=\"col\">Created</th>");


    });

    it('should redirect to original url onclick of shortened url', async () => {
        const user = await UserSchema.create({ username: 'tonia', email: 'tonia@mail.com', password: '123456', cPassword: '123456' });

        const login = await request(app)
            .post('/auth/login')
            .set('content-type', 'application/json')
            .send({
                email: 'tonia@mail.com',
                password: '123456'
            })

        loginToken = login.body.data;

        const BASE = process.env.BASE;
        const urlId = nanoid(5);
        await UrlSchema.create({
            urlId: urlId,
            origUrl: "https://github.com/AnthoniaNwanya",
            shortUrl: (`${BASE}/${urlId}`),
            User: user.email,
            createdAt: new Date(),
        });

        const response = await request(app)
            .get('/' + urlId)

        expect(response.headers.location).toMatch("https://github.com/AnthoniaNwanya")
    });


});