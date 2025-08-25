const joi = require('joi');

// Validation schema for category creation
const categorySchema = joi.object({
  categoryName: joi.string().min(3).max(30).required(),
  slug: joi.string().min(3).max(30).required(),
});

// Middleware to validate category data
const validateCategory = (req, res, next) => {
  const { error } = categorySchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
}

module.exports = validateCategory;