const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    courseName: {
        type: String,
        required: false,
        unique: false,
    },
    courseDescription: {
        type: String,
        required: false,
    },
    coursePrice: {
        type: Number,
        required: false,
    },
    courseFeatured:[ 
        {
           type: String,
              required: false,
        }]
    ,
    courseImage: {
        type: String,
        required: false,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    paymnetLink: {
        type: String,
        required: false,
    },
    type: {
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

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;