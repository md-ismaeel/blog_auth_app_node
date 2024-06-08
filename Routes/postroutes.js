const express = require('express');
const postController = require('../Controller/controllerPost');
const { listPosts, createPost, getPostById, editPost, deletePost, commentPost } = postController;

const roleMiddleware = require('../MIddleware/roleMiddleware')
const postRouter = express.Router();

postRouter.post('/create-post', createPost);

postRouter.get('/post-list', listPosts)

postRouter.get('/:id', getPostById)

postRouter.put('/:id', editPost)

postRouter.delete('/:id', deletePost)

postRouter.post('/comment/:id', commentPost)

module.exports = postRouter;