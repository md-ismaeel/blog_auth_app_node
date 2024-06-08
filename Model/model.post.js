const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    body: {
        type: String,
        required: false,
        default: "Lorem ipsum",
    },
    tags: {
        type: Array,
        required: true,
    },
    userId: {
        type: mongoose.Types.ObjectId, // _id data type
        ref: "user", // Connecting collection (posts <-> users)
    },
    view: {
        type: Number
    },
    comments: [
        {
            _id: false,
            comment: {
                type: String,
            },
            date: {
                type: Date,
                default: new Date(),
            },
            userId: {
                type: mongoose.Schema.Types.ObjectId,
            },
        },
    ],
}, {
    timestamps: true
})

const postModel = mongoose.model("post", postSchema);

module.exports = postModel;