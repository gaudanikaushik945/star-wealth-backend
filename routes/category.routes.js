const express = require('express');
const router = express.Router();
const { createCategory, getAllCategories, updateCategory, deleteCategory } = require('../controller/category.controller');
const validateCategory = require('../validation/category.validation');
const {authenticateAdmin} = require('../middleware/auth');

// Route to create a new category
router.post('/create/categories',authenticateAdmin,createCategory);

// Route to get all categories or a specific category by name or ID
router.get('/get/categories', getAllCategories);

// Route to update a category by ID
router.put('/update/categories', authenticateAdmin, updateCategory);

// Route to delete a category by ID
router.delete('/delete/categories', authenticateAdmin,deleteCategory)
module.exports = router;