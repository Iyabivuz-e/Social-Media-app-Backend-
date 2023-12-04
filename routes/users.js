const router = require('express').Router()
const bcrypt = require('bcrypt')
const Users = require('../models/Users')


// **********update user************

    router.route('/:id').put(async(req, res) => {
        if(req.body.userId === req.params.id || req.body.admin){
            if(req.body.password){

                try {
                    const salt = await bcrypt.genSalt(10)
                    req.body.password = await bcrypt.hash(req.body.password, salt)
                    
                } catch (error) {
                    res.status(500).json("Password is not updated")
                }
            }

            try {
                const newUser = await Users.findByIdAndUpdate(req.params.id, {
                    $set: req.body
                })
                res.status(200).json("Account has been updated succesfully")
            } catch (error) {
                return res.status(500).json("Failed to update the account. Try again")
            }

        }else{
            return res.status(403).json("You can only update your own account")
        }
    })
      

    // **********delete user************

    router.route('/:id').delete(async(req, res) => {
        if(req.body.userId === req.params.id || req.body.admin){
            try {
                await Users.findByIdAndDelete(req.params.id)
                res.status(200).json("User deleted succesfully")
            } catch (error) {
                res.status(500).json("User was not ddeleted. Try again", error)
            }
        }else{
            return res.status(403).json("You can only delete your account")
        }
    })

    // **********get a user************

    router.route('/:id').get(async(req, res) => {
        try {
            const user = await Users.findById(req.params.id)
            const {password, createdAt, updatedAt, ...other} = user._doc
            if(!user){
                res.status(404).json({error: "User does not exist"})
            }
            res.status(200).json(other)
            
        } catch (error) {
            res.status(500).json(error)
        }
    })


    // **********follow a user************

    router.route('/:id/follow').put(async(req, res) => {
        if(req.body.userId !== req.params.id){
            try {
                const user = await Users.findById(req.params.id)
                const currentUser = await Users.findById(req.body.userId)
                if(!user.followers.includes(req.body.userId)){
                    await user.updateOne({$push: {followers: req.body.userId}})
                    await currentUser.updateOne({$push: {following: req.params.id}})
                    res.status(200).json("User followed succesfully")
                }else{
                    res.status(403).json("you already follow this user")
                }

            } catch (error) {
                res.status(500).json(error)
            }

        }else{
            res.status(403).json("You can not follow yourself")
        }
    })


    // **********unfollow a user************

    router.route('/:id/unfollow').put(async(req, res) => {
        if(req.body.userId !== req.params.id){
            try {
                const user = await Users.findById(req.params.id)
                const currentUser = await Users.findById(req.body.userId)
                if(user.followers.includes(req.body.userId)){
                    await user.updateOne({$pull: {followers: req.body.userId}})
                    await currentUser.updateOne({$pull: {following: req.params.id}})
                    res.status(200).json("Unfollowed the user")
                }else{
                    res.status(500).json("You do not follow this user")
                }
            } catch (error) {
                res.status(500).json(error)
            }
        }else{
            res.status(403).json("You can not unfollow yourself")
        }
    })

module.exports = router