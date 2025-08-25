const express = require('express');
const router = express.Router();
const { createCourse, getAllCourses, updateCourse, deleteCourse } = require('../controller/course.controller');
const validateCourse = require('../validation/course.validation');
const upload = require('../middleware/multer');
const { authenticateAdmin } = require('../middleware/auth');

// Route to create a new course
router.post('/create/courses',  authenticateAdmin,upload.single('courseImage'), createCourse);

// Route to get all courses or filter by name, description, or price
router.get('/get/courses', getAllCourses);

// Route to update a course by ID
router.put('/update/courses', authenticateAdmin,upload.single('courseImage'), updateCourse);

// Route to delete a course by ID
router.delete('/delete/courses', authenticateAdmin,deleteCourse);

module.exports = router;