const express = require("express")
const router = express.Router()
const classesController = require("../controller/classes.controller")


router.post("/create/classes", classesController.createClasses)


router.get("/get/classes", classesController.getClasses)

router.put("/update/classes", classesController.updateClasses)

router.delete("/delete/classes", classesController.deleteClasses)
module.exports = router