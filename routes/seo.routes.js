const express = require("express")

const router = express.Router();
const {  getAllSEOs, createSEO, updateSEO, deleteSEO } = require("../controller/seo.controller");
const validateSeo = require("../validation/seo.validation");
const { authenticateAdmin } = require("../middleware/auth");
const upload = require("../middleware/multer");

// Route to create a new SEO entry
router.post(
  "/create/seo",
  authenticateAdmin,
  upload.single("seoImage"), // ✅ corrected field name
  validateSeo,
  createSEO
);

// Route to get all SEO entries or filter by title or slug
router.get("/get/seo", getAllSEOs);

// Route to update an SEO entry by ID
router.put("/update/seo", authenticateAdmin, updateSEO);

// Route to delete an SEO entry by ID
router.delete("/delete/seo", authenticateAdmin,deleteSEO);
    

module.exports = router;