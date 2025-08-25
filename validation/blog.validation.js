const joi = require('joi');

// Validation schema for blog creation
const blogSchema = joi.object({
  title: joi.string().min(3).max(100).optional(),
  content: joi.string().min(10).optional(),
    authName: joi.string().min(3).max(50).optional(),
    category: joi.string().optional(), // Assuming category is an ObjectId in string format
    shortDescription: joi.string().max(200).optional(),
    BlogImage: joi.string().uri().optional(), // Assuming BlogImage is a URL
    slug: joi.string().min(3).max(100).optional()
});

// Middleware to validate blog data
const validateBlog = (req, res, next) => {
  const { error } = blogSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
}

module.exports = validateBlog;