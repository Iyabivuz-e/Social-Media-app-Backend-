const Posts = require('../models/Posts')
const Users = require('../models/Users')

const router = require('express').Router()

// *******Create a new post********
router.route('/').post(async (req, res) => {
    const newPost = new Posts(req.body)
    try {
        const savedPost = await newPost.save()
        res.status(200).json(savedPost)
    } catch (error) {
        res.status(403).json(error)
    }
})

// ********Update a post*********
router.route('/:id').put(async(req, res) => {
    const myPost = await Posts.findById(req.params.id)
    try {
        if(myPost.userId === req.body.userId){
            await myPost.updateOne({$set: req.body})
            res.status(200).json("Psot was updated succesfully")
        }else{
            res.status(404).json("Post is not found")
        }
    } catch (error) {
        res.status(500).json(error)
    }
})

// ********Update a post*********
router.route('/:id').delete(async(req, res) => {
    const myPost = await Posts.findById(req.params.id)
    try {
        if(myPost.userId === req.body.userId){
            await myPost.deleteOne()
            res.status(200).json("Psot was deleted succesfully")
        }else{
            res.status(404).json("Post is not found")
        }
    } catch (error) {
        res.status(500).json(error)
    }
})

// ********Likes and Dislikes*********
router.route('/:id/like').put(async(req, res) => {
    try {
        const post = await Posts.findById(req.params.id)
        if(!post.likes.includes(req.body.userId)){
            await post.updateOne({$push: {likes: req.body.userId}})
            res.status(200).json("You liked the post")
        }else{
            await post.updateOne({$pull: {likes: req.body.userId}})
            res.status(200).json("You disliked the post")
        }
    } catch (error) {
        res.status(500).json(error)
    }
})

// ********Get a post*********
router.route('/:id').get(async(req, res) => {
    try {
        const post = await Posts.findById(req.params.id)
        if(!post){
            res.status(404).json("Post does not exist")
            return;
        }
        res.status(200).json(post)
        
    } catch (error) {
        res.status(500).json(error)
    }
})

// ********Get a timeline all*********
router.route('/timeline/all').get(async(req, res) => {
    try {
        const currentUser = await Users.findById(req.body.userId)
        const userPosts = await Posts.find({userId: currentUser._id})
        const friendPosts = await Promise.all(
            currentUser.following.map(friendId => {
                Posts.find({userId: friendId})
            })
        )
        res.json(userPosts.concat(...friendPosts))
    } catch (error) {
        res.status(500).json(error)
    }
})

module.exports = router

