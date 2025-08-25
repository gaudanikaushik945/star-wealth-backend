const express = require('express');
const router = express.Router();
const { createAdmin, loginAdmin, changePassword } = require('../controller/admin.controller');
const validateAdmin = require('../validation/admin.validation');
const upload = require('../middleware/multer');

// Route to create a new admin
router.post('/create/admin', validateAdmin, createAdmin);

router.post("/login/admin", validateAdmin, loginAdmin)

router.post("/changed/password", changePassword)

module.exports = router;