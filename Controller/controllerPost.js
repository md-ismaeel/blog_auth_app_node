const postModel = require('../Model/model.post')

const createPost = async (req, res) => {
    // console.log(req.user._id);
    const newPost = new postModel({
        ...req.body,
        userId: req.user._id
    })

    const insertedData = await newPost.save()

    res.json({
        sucess: true,
        message: 'data blog added successfully',
        post_id: insertedData._id
    })
};

const listPosts = async (req, res) => {
    // console.log(req.query.pageNumber);

    let pageNumber = req.query.pageNo || 1;
    pageNumber *= 1;

    let pageSize = req.query.pageSize || 10;
    pageSize *= 1;

    const postList = await postModel.find({})
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
        .sort({ views: 1 })
        .populate('userId')

    res.json({
        results: postList,
    });
}


const getPostById = async (req, res) => {
    // console.log(req.params.id);
    try {
        const post_id = req.params.id;
        const post = await postModel.findById(post_id).populate('userId')

        res.json({
            sucess: true,
            message: 'find post successfully',
            results: post
        })
    } catch (err) {
        res.json({
            success: false,
            message: 'post not found verify the post id'
        })
    }
}

const editPost = async (req, res) => {

    try {
        const post_id = req.params.id;
        const post = await postModel.findByIdAndUpdate(post_id, req.body)
        res.json({
            success: true,
            message: 'post edited successfully',
        })

    } catch (err) {
        res.json({
            success: false,
            message: 'something went wrong, plz try agin later'
        })
    }
}

const deletePost = async (req, res) => {
    try {
        const post_id = req.params.id;
        const post = await postModel.findByIdAndDelete(post_id)
        res.json({
            success: true,
            message: 'post deleted successfully'
        })
    } catch (err) {
        res.json({
            success: false,
            message: 'post not deleted please check your id'
        })
    }
}


const commentPost = async (req, res) => {
    try {
        const post_id = req.params.id;
        await postModel.updateOne(
            { _id: post_id },
            {
                $push: {
                    comments: {
                        comment: req.body.comment,
                        userId: req.user._id
                    },
                },
            }
        )
        res.json({
            success: true,
            message: 'commentPost created successfully'
        })

    } catch (err) {
        res.json({
            sucess: false,
            message: 'something went wrong please check the _id its not matching', err
        })
    }
}

const postController = {
    createPost,
    listPosts,
    getPostById,
    editPost,
    deletePost,
    commentPost
};

module.exports = postController;