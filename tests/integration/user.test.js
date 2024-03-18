const request = require('supertest');
const app = require('../../index');
const { connect } = require('./database');
const UserSchema = require('../../schema/UserSchema');

describe('User Route', () => {
    let conn;
    let user;
    
    beforeAll(async () => {
        conn = await connect();
        const createuser = await UserSchema.create({ username: 'tonia', email: 'tonia@mail.com', password: '123456', cPassword: '123456'});
        user = createuser
    })

    afterEach(async () => {
        await conn.cleanup();
        
    })

    afterAll(async () => {
        await conn.disconnect();
    });

    it('should return all users', async () => {
        const response = await request(app).get('/api/user');

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('data');
        expect(response.body.data).toEqual(expect.any(Array));
        expect(response.body.data).toHaveLength(1);
        expect(response.body).toHaveProperty('message', 'Users retrieved successfully');
    });

    it('should return empty array if no users are found', async () => {
        const response = await request(app).get('/api/user');

        expect(response.body).toHaveProperty('data');
        expect(response.body.data).toEqual([]);
        expect(response.body.data).toHaveLength(0);
        expect(response.body).toHaveProperty('message', 'Users retrieved successfully');
    });

    it('should return a user by email', async () => {
        const createUser = await UserSchema.create({ username: 'testname', email: 'test@mail.com', password: '1234567', cPassword: '1234567' });
        const response = await request(app).get('/api/user/' + createUser.email)

        expect(response.status).toBe(200);
        expect(response.body.data).toHaveProperty('_id');
        expect(response.body.data).toHaveProperty('URLS', []);
        expect(response.body.data).toHaveProperty('email', 'test@mail.com');
        expect(response.body.data).toHaveProperty('username', 'testname');
        expect(response.body.data).not.toHaveProperty('password');
        expect(response.body).toHaveProperty('message', 'User retrieved successfully');
    });

    it('should throw an error if no user was found', async () => {
        const response = await request(app).get('/api/user/' + user.email)

        expect(response.status).toBe(500);
        expect(response.body).toHaveProperty('message', 'User not found');
    });

    it('should redirect a user to dashboard after successful update', async () => {
        const createUser = await UserSchema.create({
            username: 'testname',
            email: 'test@mail.com',
            password: 'test123',
            cPassword: 'test123'
        });
        const userId = createUser._id.toString()
        const login = await request(app).post('/login')
            .send({
                email: 'test@mail.com',
                password: 'test123',
            })
        const loginResponse = login.headers['set-cookie'];
        const response = await request(app).post('/api/user/update/' + userId)
            .send({
                username: 'updatename',
                email: 'update@mail.com',
               
            })
            .set("Cookie", loginResponse)
            .redirects(0)

        expect(response.status).toBe(302);
        expect(response.headers.location).toMatch("/api/user/update/:id");

    });

    it('should successfully delete a user account by id and redirect to the signup page', async () => {
        const createUser = await UserSchema.create({
            username: 'deletetname',
            email: 'delete@mail.com',
            password: 'delete123',
            cPassword: 'delete123'
        });
        const userId = createUser._id.toString()
        const login = await request(app).post('/login')
            .send({
                email: 'delete@mail.com',
                password: 'test123',
            })
        const loginResponse = login.headers['set-cookie'];
        const response = await request(app).post('/api/user/delete/' + userId)
            .set("Cookie", loginResponse)
            .redirects(0)

        expect(response.status).toBe(302);
        expect(response.headers.location).toMatch("/")
    });

});
