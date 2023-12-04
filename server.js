require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const helmet = require('helmet')
const connectDB = require('./database/connectDB')
const app = express()
//Importing Routes
const usersRoute = require('./routes/users')
const authRoute = require('./routes/auth')
const postsRoute = require('./routes/posts')

// Middlewares
app.use(morgan("common"))
app.use(helmet())
app.use(express.json())

// Routes
app.use("/api/users", usersRoute)
app.use("/api/auth", authRoute)
app.use('/api/posts', postsRoute)


// Server
const port = process.env.PORT || 5000
const start = async () =>{
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port, () => console.log(`lisening to the port ${port}`))
    } catch (error) {
        console.log(error)
    }
}

start()