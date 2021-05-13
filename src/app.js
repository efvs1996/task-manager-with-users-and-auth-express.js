const express = require('express')
require('./db/mongoose')
const taskRouter = require('./routers/taskRouter')
const userRouter = require('./routers/userRouter')
const app = express()


app.use(express.json())
app.use(taskRouter)
app.use(userRouter)

module.exports = app