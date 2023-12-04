const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        min: 3,
        max: 10,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        max: 50,
    },
    password: {
        type: String,
        required: true,
        max: 8,
    },
    profilePicture: {
        type: String,
        default: "",
    },
    coverPicture: {
        type: String,
        default: "",
    },
    followers: {
        type: Array,
        default: [],
    },
    following: {
        type: Array,
        default: [],
    },
    admin: {
        type: Boolean,
        default: false,
    },
    // Info model imbeded here
    desc: {
        type: String,
        max: 50,
    },
    city: {
        type: String,
        max: 50,
    },
    from: {
        type: String,
        max: 50,
    },
    status: {
        type: Number,
        enum : [1,2,3],
    },
},
    {timestamps:true}
)

module.exports = mongoose.model("User", userSchema)