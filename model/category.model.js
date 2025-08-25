const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({    
    categoryName: {
        type: String,
        required: true,
        unique: true,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    slug: {
        type: String,
        required: true,
    }
},
{
    timestamps: true,
}
)

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;