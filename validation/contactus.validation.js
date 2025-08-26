const joi = require('joi');

// Validation schema for contact us form
const contactUsSchema = joi.object({
  name: joi.string().min(3).max(50).required(),
    email: joi.string().email().required(),
    phoneNumber: joi.string().max(10).pattern(/^\d+$/).required(), // Assuming phoneNumber is a string of digits
    message: joi.string().min(10).max(500).required(),
    
});

// Middleware to validate contact us data
const validateContactUs = (req, res, next) => {
  const { error } = contactUsSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
}

module.exports = validateContactUs;