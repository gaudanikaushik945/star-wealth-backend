const express = require('express');
const router = express.Router();
const {createBlog, getAllBlogs, updateBlog, deleteBlog} = require('../controller/blog.controller');
const validateBlog = require('../validation/blog.validation');
const upload = require('../middleware/multer');
const {authenticateAdmin} = require('../middleware/auth');

// Route to create a new blog
router.post('/create/blogs', authenticateAdmin,upload.single('BlogImage'), createBlog);

// Route to get all blogs or filter by title, categoryId, or slug
router.get('/get/blogs', getAllBlogs);

// Route to update a blog by ID
router.put('/update/blogs', authenticateAdmin,upload.single('BlogImage'), updateBlog);

// Route to delete a blog by ID
router.delete('/delete/blogs', authenticateAdmin,deleteBlog);


module.exports = router;