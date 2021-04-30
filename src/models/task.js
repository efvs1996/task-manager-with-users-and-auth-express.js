const mongoose = require("mongoose")


const taskSchema = new mongoose.Schema({
    name: {
        type : String,
        required : true
    },
    completed : {
        type : Boolean, 
        default: false
    },
    owner : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : 'User'
    }
},
{
    timestamps : true
})



taskSchema.pre('save', async function (next) {
    const task = this

    if (task.isModified('name')){
        console.log("Se modifico el nombre, el nuevo nombre es ", task.name)
    }
    await next()
})
 
const Task = mongoose.model('Task', taskSchema)

module.exports = Task

