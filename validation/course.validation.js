const joi = require('joi');

// Validation schema for course creation    
const courseSchema = joi.object({   
    courseName: joi.string().min(3).max(100).optional(),
    courseDescription: joi.string().optional(),
    coursePrice: joi.number().min(0).optional(),
    courseFeatured: joi.array().items(joi.string()).optional(),
    // courseImage: joi.string().optional(),
    paymnetLink: joi.string().optional(),
    type: joi.string().optional(),
    slug: joi.string().optional()
});

// Middleware to validate course data
const validateCourse = (req, res, next) => {
    const { error } = courseSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
}

module.exports = validateCourse;