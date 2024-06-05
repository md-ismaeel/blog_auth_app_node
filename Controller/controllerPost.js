const postsList = require('../Controller/post.json');
const authModel = require('../Model/model')

const listPosts = async (req, res) => {
    const user = await authModel.find()
    if (user) {
        res.json({
            results: user,
        });
    };
}

const createPost = async (req, res) => {
    res.json({
        sucess: true,
        message: "Post created successfully",
    });
};

const postController = {
    listPosts,
    createPost,
};

module.exports = postController;