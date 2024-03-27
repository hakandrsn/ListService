const router = require("express").Router();
const user = require("../controller/user");

const multer = require("multer");

const storage = multer.diskStorage({});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb("invalid image file!", false);
  }
};

const uploads = multer({ storage, fileFilter });

router.post("/register", uploads.single("profile"), user.register);
router.post("/login", user.login);
router.post("/relogin", user.relogin);

module.exports = router;
