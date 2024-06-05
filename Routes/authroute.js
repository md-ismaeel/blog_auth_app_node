const express = require('express');

const authController = require('../Controller/controllerAuth');
const { signUp, signIn } = authController;

const authRouter = express.Router();

authRouter.post('/signUp', signUp)
authRouter.post('/login', signIn)

module.exports = authRouter;