const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const cors = require("cors");
const { rateLimit } = require("express-rate-limit");
const MongoStore = require("rate-limit-mongo");

const authRouter = require('./Routes/authroute');
const postRouter = require('./Routes/postroutes');

const passport = require('./MIddleware/authMiddleware');

const app = express();

const port = process.env.PORT || 10000;
const mongoDbConnection = process.env.MONGODBCONNECTION;


if (!mongoDbConnection) {
    throw new Error("MongoDB connection details are not set in .env file");
}

const corsOptions = {
    origin: "http://localhost:5173",
    optionsSuccessStatus: 200,
};

const windowMs = 30 * 60 * 1000;

const limiter = rateLimit({
    store: new MongoStore({
        uri: mongoDbConnection,
        // user: atlasUser,
        // password: atlasPassword,
        expireTimeMs: windowMs,
        errorHandler: console.error.bind(null, "rate-limit-mongo"),
    }),
    windowMs: windowMs,
    max: 10, // Limit each IP to 4 requests per windowMs
    message: "Too many requests from this IP, please try again after 30 minutes"
});

app.use(cors(corsOptions));
app.use(express.json());
app.use(limiter);

mongoose.connect(mongoDbConnection)
    .then(() => console.log('MongoDB connected successfully'))
    .catch((err) => console.error('Error, DB not connected:', err));

app.use('/api/v1/', authRouter);
app.use('/api/v1/post', passport.authenticate("jwt", { session: false }), postRouter);

app.use('/*', (req, res) => {
    res.status(404).json({
        success: false,
        message: "Path not found"
    });
});


app.listen(port, () => console.log(`Server is up and running on port ${port}`));
