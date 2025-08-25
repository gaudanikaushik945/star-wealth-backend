const joi = require('joi');

// Validation schema for admin creation
const adminSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().min(6).required(),
});

// Middleware to validate admin data
const validateAdmin = (req, res, next) => {
  const { error } = adminSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
}

module.exports = validateAdmin;