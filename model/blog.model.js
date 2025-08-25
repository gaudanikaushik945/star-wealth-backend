const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: false,
    },
    content: {
        type: String,
        required: false,
    },
    authName: {
        type: String,
        required: false,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: false,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    publishedAt: {
        type: Date,
        default: Date.now,
    },
    shortDescription: {
        type: String,
        required: false,
    },
    BlogImage: {
        type: String,
        required: false,
    },
    slug: {
        type: String,
        required: false,
        unique: false,
    }
}, {
    timestamps: true,
});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;