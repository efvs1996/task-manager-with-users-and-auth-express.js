const express = require('express')
require('./db/mongoose')
const taskRouter = require('./routers/taskRouter')
const userRouter = require('./routers/userRouter')
const app = express()
const port = process.env.PORT

app.use(express.json())
app.use(taskRouter)
app.use(userRouter)

app.listen(port, () => {
    console.log("Server is up on port ", port)
})