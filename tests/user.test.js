const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user');
const { userOne, userOneId, setupDataBase } = require('../tests/fixtures/db')

beforeEach(setupDataBase)

test('Should signup a new user', async () => {
    const response = await request(app).post('/users').send({
        name: 'andrew',
        email: 'efvs1996@gmail.com',
        password: 'hola123'
    })
    .expect(201)
    const user = await User.findById(response.body._id)
    expect(user).not.toBeNull()
    expect(response.body.name).toBe('andrew')
    expect(response.body).toMatchObject({
            name : user.name,
            email : user.email,  
            tokens : [{
                token: user.tokens[0].token
            }]
    })
})

test('Should login existing user', async () => {
        const response = await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)
        const user = await User.findById(response.body.user._id)
        expect(response.body.token).toBe(user.tokens[1].token)
})

test('Should get profile for user', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens.token}`)
        .send()
        .expect(200)
})

test('Should not get profile for unauthenticated user', async () => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
})

test('Should delete account for user', async () => {
    const response = await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens.token}`)
        .send()
        .expect(200)
        const user = await User.findById(response.body._id)
        expect(user).toBeNull()
})

test('Should NOT delete account for user', async () => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
})

test('Should update information from the user', async () => {
    await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens.token}`)
    .send({
        name : 'Holsix'
    })
    .expect(200)
})

test('Should not update invalid user fields', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens.token}`)
        .send({
            location: 'Philadelphia'
        })
        .expect(400)
})

test('Should upload avatar image', async () => {
    await request(app)
        .post('/users/upload/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens.token}`)
        .attach('avatar', 'tests/fixtures/profile-pic.jpg')
        .expect(200)
    const user = await User.findById(userOneId)
    expect(user.avatar).toEqual(expect.any(Buffer))
})