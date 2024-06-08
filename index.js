const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config()

const authRouter = require('./Routes/authroute');
const postRouter = require('./Routes/postroutes')

const authMiddleware = require('./MIddleware/authMiddleware')

const app = express();

const port = process.env.PORT;
const mongoDbConnection = process.env.MONGODBCONNECTION


app.use(express.json())

mongoose.connect(mongoDbConnection)
    .then(() => console.log('mongoDb connected successfully'))
    .catch((err) => console.log('Error, db not connected', err))

app.use('/api/v1/', authRouter)
app.use('/api/v1/post', authMiddleware, postRouter)

app.use('/*', (req, res) => {
    res.status(404).json({
        success: false,
        message: "Path not found"
    })
})


app.listen(port, () => console.log(`Server is up and running on port ${port}`))