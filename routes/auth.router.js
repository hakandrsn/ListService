const router = require("express").Router();
const user = require("../controller/user.controller");


router.post("/register", user.register);
router.post("/login", user.login);
router.post("/logintoken", user.loginToken);

module.exports = router;
