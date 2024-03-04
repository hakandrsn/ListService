const express = require("express");
const { authenticate } = require("../middleware/auth.mw");
const user = require("../controller/user.controller");

const router = express.Router();

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

router.get("/profile", authenticate, user.getProfile);

router.post("/addmission", authenticate, user.addMission);
router.post("/completemission", authenticate, user.completemission);
router.post("/failedmission", authenticate, user.failedmission);
// router.get("/fix", user.fixGameList);
router.post(
  "/upload-profile",
  authenticate,
  uploads.single("profile"),
  user.uploadProfile
);

router.get("/users/:page", authenticate, user.getUserWithPage);
router.get("/users/search/:searchParam", authenticate, user.getUsersWithSearch);

module.exports = router;

