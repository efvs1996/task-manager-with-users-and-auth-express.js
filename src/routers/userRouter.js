const express = require('express')
const User = require('../models/user')
const router = new express.Router()
const auth = require('../middleware/auth')
const multer = require('multer')
const sharp = require('sharp')
const { sendCancellationEmail, sendWelcomeEmail } = require('../emails/sendEmail')



const upload = multer({
    limits : {
        fileSize : 1000000},
    fileFilter( req, file , cb){
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error("Please upload a jpg, jpeg or png file"))
        }

        cb(undefined,true)
    }
})

router.post('/users/upload/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send() 
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message})
})

router.post('/users/delete/me/avatar', auth, async (req,res) => {
    try {
        req.user.avatar = undefined
        await req.user.save()
        res.status.send()
    } catch(e){
        res.status(500).send()
    }
})
router.get('/users/:id/avatar', async (req, res) => {
    try { 
        const user = await User.findById(req.params.id)

        if(!user || !user.avatar){
            throw new Error()
        }

        res.set('Content-Type', 'image/png')
        res.send(user.avatar)

    } catch (e) {
        res.status(404).send()
    }
})


router.post('/users', async (req, res) => {
   const user = new User(req.body)
    try  {
        await user.generateAuthToken()
        sendWelcomeEmail(user.email, user.name)
        await user.save()
        res.send(user)
        console.log("Usuario insertado ", user)
    } catch (e) {
        res.send("Este usuario ya existe")
    }
})

router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})

router.get('/users', auth, async (req, res) => {
    try {
        const users = await User.find({})
        res.send(users)
    } catch (e){
        res.status(500).send()
    }
})

router.post('/users/logout', auth, async (req,res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !==req.token
        })
        await req.user.save()
        res.send()
    } catch(e){
        res.status(500).send()
    }
})

router.post('/users/logoutAll', auth , async (req,res) => {
    try{
        req.user.tokens = []
        await req.user.save()
        res.send()
        }catch(e){
        res.status(500).send()
        }
})

router.post('/users/login', async (req, res) => {
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({user, token})
    } catch (e) {
        res.status(400).send("error")
    }
})


router.patch('/users/me', auth,  async (req,res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidOperation){
        res.status(400).send({ error : 'Invalid Updates'})
    }
    try{
        
        updates.forEach((update) => user[update] = req.body[update])
        await req.user.save()
        /*const user = await User.findByIdAndUpdate( req.params.id, req.body, { new: true} )
        if (!user){
            console.log("Este es el if para probar")
        return res.send("hay un error")*/
        console.log("El usuario se ingreso con exito")
        res.send(user)
    }catch(e){
        res.status(400).send(e)
        console.log("No se pudo ingresar por un error 2")
    }
})

router.delete('/users/me', auth,  async (req, res) => {
    try {
        sendCancellationEmail(req.user.email, req.user.name)
        await req.user.remove()
        res.send(req.user)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router