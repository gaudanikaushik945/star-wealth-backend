const joi = require('joi');

// Validation schema for SEO data
const seoSchema = joi.object({
  title: joi.string().min(3).max(100).required(),
  description: joi.string().min(10).max(500).required(),
  keywords: joi.array().items(joi.string()).optional(),
  slug: joi.string().max(100).required(),
  // seoImage: joi.string().optional()
});

// Middleware to validate SEO data
const validateSEO = (req, res, next) => {
  const { error } = seoSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
}

module.exports = validateSEO;