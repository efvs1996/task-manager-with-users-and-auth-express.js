const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('../../src/models/user');
const Task = require('../../src/models/task');

const userOneId = new mongoose.Types.ObjectId()
const userOne = {
    _id: userOneId,
    name: 'Mike',
    email: 'mike@example.com',
    password: 'hola123',
    tokens : {
        token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)
    }
}

const userTwoId = new mongoose.Types.ObjectId()
const userTwo = {
    _id: userTwoId,
    name: 'Donald',
    email: 'donald@example.com',
    password: 'hola123',
    tokens : {
        token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET)
    }
}

const taskOneId = new mongoose.Types.ObjectId()
const taskOne = {
    _id : taskOneId,
    name : 'task uno',
    owner : userOneId
}

const taskTwoId = new mongoose.Types.ObjectId()
const taskTwo = {
    _id : taskTwoId,
    name : 'task dos',
    owner : userOneId
}

const taskThreeId = new mongoose.Types.ObjectId()
const taskThree = {
    _id : taskThreeId,
    name : 'task tres',
    owner : taskThreeId
}

const setupDataBase = async () => {
    await User.deleteMany()
    await Task.deleteMany()
    await new User(userOne).save()
    await new Task(taskOne).save()
    await new Task(taskTwo).save()
    await new Task(taskThree).save()
}

module.exports = {
    userOneId,
    userOne,
    userTwoId,
    userTwo,
    taskOneId,
    setupDataBase
}