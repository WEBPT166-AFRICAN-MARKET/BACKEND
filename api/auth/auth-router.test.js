const server = require('../server.js');
const db = require('../../database/dbConfig');
const request= require('supertest');

describe('server.js', () => {
    test('checks for the testing environment', () => {
        expect(process.env.DB_ENV).toBe('testing');
    });
})

describe('post /auth/register', () => {
    let res = {};

    beforeAll(async () => {
        //await db('users').truncate();
        res = await request(server).post('/api/auth/register').send({ username: 'mhillin', password: 'password123' })
    });

    it('uses json', () => {
        expect(res.type).toBe('application/json')
    })
});

describe('post /auth/login', () => {
    beforeAll(async () => {
        res = await request(server).post('/api/auth/login').send({  username: 'mhillin', password: 'password123'  });
    });

    it('uses json', () => {
        expect(res.type).toBe('application/json');
    })
});
