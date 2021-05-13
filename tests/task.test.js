const app = require('../src/app');
const request = require('supertest')
const Task = require('../src/models/task')
const { userOne, userOneId, userTwo, taskOneId, userTwoId, setupDataBase } = require('../tests/fixtures/db');


beforeEach(setupDataBase)

test('should create task for user', async () => {
    const response = await request(app)
    .post('/tasks')
    .set('Authorization', `Bearer ${userOne.tokens.token}`)
    .send({
        name: 'Robar banco'
    })
    .expect(201)
    const task = await Task.findById(response.body._id)
    expect(task).not.toBeNull()
    expect(task.completed).toEqual(false)
})

test('should get tasks and check amount of task for user', async () => {
    const response = await request(app)
    .get('/tasks')
    .set('Authorization', `Bearer ${userOne.tokens.token}`)
    .send()
    .expect(200)
    expect(response.body.length).toEqual(2)
})

test('User 2 should not be able to delete task', async () => {
    const response = await request(app)
    .delete('/tasks/:id')
    .set('Authorization', `Bearer ${userTwo.tokens.token}`)
    .send(
        { id : taskOneId}
    )
    .expect(401)
})
