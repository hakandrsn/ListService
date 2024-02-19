const express = require("express");
const { authenticate } = require("../middleware/auth.mw");
const user = require("../controller/user.controller");

const router = express.Router();

const multer = require("multer");

const storage = multer.diskStorage({});

const fileFilter = (req, file, cb) => {
  console.log(req.body.image);
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb("invalid image file!", false);
  }
};

const uploads = multer({ storage, fileFilter });

router.get("/profile", authenticate, user.getProfile);

router.put("/addmission", authenticate, user.addMission);
router.put("/completemission", authenticate, user.completemission);
router.put("/failedmission", authenticate, user.failedmission);
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
