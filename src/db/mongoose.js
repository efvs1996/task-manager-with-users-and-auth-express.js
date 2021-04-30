const mongoose = require('mongoose')

mongoose.connect( process.env.MONGO_DEV_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: false,

})

/*user.save().then(() => {
    console.log(user)
}).catch((error) => {
    console.log(error)
})*/


/*task.save().then(() => {
    console.log(task)
}).catch((error) => {
    console.log(error)
})*/

/*const User = mongoose.model('User',{

    name : {
        type : String
    },
    age: {
        type : Number
    }
})


const me = new User({
    name: 'Elsa',
    age : 27
})

me.save().then(() => {
    console.log(me)
}).catch((error) => {
    console.log(error)
})*/
    
