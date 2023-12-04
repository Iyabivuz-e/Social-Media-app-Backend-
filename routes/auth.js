const router = require('express').Router()
const User = require('../models/Users')
const bcrypt = require('bcrypt')


// USER REGISTRATION
router.route('/register').post( async(req, res) => {
    try {
        // Hashing password (Securing password)
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(req.body.password, salt)

        // Creating user
        const newUser = new User({
            username : req.body.username,
            email : req.body.email,
            password : hashedPassword,
        })

        // Saving new user in the database
        const user = await newUser.save()
        res.status(200).json(user)
    } catch (error) {
        // res.status(404).json(error)
        console.log(error)
    }

})

    // USER LOGIN
    router.route('/login').post( async(req, res) => {
        try {
            const user = await User.findOne({
                email: req.body.email
            })
            !user && res.status(404).json("user does not exist")

            const validPassword = await bcrypt.compare(
                req.body.password, user.password 
                )
            !validPassword && res.status(404).json("Wrong password")
            res.status(200).json(user)
        } catch (error) {
            // res.status(404).json(error)
            console.log(error)
        }
    })

module.exports = router