const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const cors = require("cors");
const { rateLimit } = require("express-rate-limit");
const MongoStore = require("rate-limit-mongo");

const authRouter = require('./Routes/authroute');
const postRouter = require('./Routes/postroutes');

const passport = require('./MIddleware/authMiddleware');
// const authMiddleware = require('./MIddleware/authMiddleware')

const app = express();

const port = process.env.PORT;
const mongoDbConnection = process.env.MONGODBCONNECTION;

const atlasUser = process.env.USER;
const atlasPassword = process.env.PASSWORD;

const corsOptions = {
    origin: "https://blogapp-kqpz.onrender.com",
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

const windowMs = 30 * 60 * 1000;

const limiter = rateLimit({
    store: new MongoStore({
        uri: mongoDbConnection,
        user: atlasUser,
        password: atlasPassword,
        // should match windowMs
        expireTimeMs: windowMs,
        errorHandler: console.error.bind(null, "rater-limit-mongo"),
        // see Configuration section for more options and details
    }),
    windowMs: windowMs, // 5 minutes
    limit: 4, // Limit each IP to 25 requests per `window` (here, per 15 minutes).
});


app.use(cors(corsOptions));
app.use(express.json());
app.use(limiter);


mongoose.connect(mongoDbConnection)
    .then(() => console.log('mongoDb connected successfully'))
    .catch((err) => console.log('Error, db not connected', err))


app.use('/api/v1/', authRouter);
app.use('/api/v1/post', passport.authenticate("jwt", { session: false }), postRouter);


app.use('/*', (req, res) => {
    res.status(404).json({
        success: false,
        message: "Path not found"
    })
})

app.listen(port, () => console.log(`Server is up and running on port ${port}`))