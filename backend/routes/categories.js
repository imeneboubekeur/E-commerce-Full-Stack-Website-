const express = require("express");
const router = express.Router();
const controller = require("../controllers/categories");
const verifyToken = require("../middleware/verifyToken");
const upload = require("../server.js");
router.get("/categories", controller.getCategories);
router.post("/categories", upload.single("image"), controller.createCategory);
router.put("/categories/:id", verifyToken, controller.updateCategory);
router.delete("/categories/:id", verifyToken, controller.deleteCategory);

module.exports = router;