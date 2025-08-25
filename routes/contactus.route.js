const express = require('express');
const validateContactUs = require('../validation/contactus.validation');
const { create } = require('../model/course.model');
const { createContactUs, getAllContacts } = require('../controller/contactus.controller');
const router = express.Router();
const { authenticateAdmin } = require('../middleware/auth');


router.post("/create/contactus", validateContactUs, createContactUs);

// Route to get all contact us entries
router.get("/get/contactus", authenticateAdmin, getAllContacts);




module.exports = router;