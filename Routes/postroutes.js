const express = require('express');
const postController = require('../Controller/controllerPost');
const { listPosts, createPost } = postController;

const roleMiddleware = require('../MIddleware/roleMiddleware')
const postRouter = express.Router();

postRouter.get('/', roleMiddleware('seller'), listPosts)
postRouter.post('/', createPost)

module.exports = postRouter;