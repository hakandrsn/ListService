const router = require("express").Router();
const category = require("../controller/category.controller");
const { authenticate } = require("../middleware/auth.mw");

router.get("/", authenticate, category.getAllCategroy);
router.get("/:path", category.getCategory);
router.post("/:path/:id", category.getOneItem);

module.exports = router;
