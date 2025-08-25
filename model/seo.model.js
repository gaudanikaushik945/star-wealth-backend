const { required } = require('joi');
const mongoose = require('mongoose');

const seoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    keywords: {
        type: [String],
        required: false,
    },  
    slug: {
        type: String,
        required: true,
        unique: true,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    seoImage: {
        type: String,
        required: false
    }
}, {
    timestamps: true,
});

const SEO = mongoose.model('SEO', seoSchema);

module.exports = SEO;