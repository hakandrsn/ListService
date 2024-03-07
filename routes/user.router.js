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

//Profile
router.get("/profile", authenticate, user.getProfile); // kullanıcı temel bilgileri ve missions lar gelecek
router.get("/profile/challanges/:page", authenticate, user.getChallanges);
router.get("/profile/favlist/:page", authenticate, user.getFavList);
router.get("/profile/friends/:page", authenticate, user.getFriends);

router.get("/profile/challange", authenticate, user.getChallange);
router.get("/profile/fav", authenticate, user.getFav);
router.get("/profile/friend", authenticate, user.getFriend);

router.post("/profile/add_challange", authenticate, user.setChallange);
router.post("/profile/add_fav", authenticate, user.setFav);
router.post("/profile/add_friend", authenticate, user.setFriend);

//Mission
router.post("/mission/accept", authenticate, user.acceptMission); //missionId gidecek
router.post("/mission/delete", authenticate, user.deleteMission);
router.post("/mission/fav", authenticate, user.favMission);
router.post("/mission/like", authenticate, user.likeMission);
router.post("/mission/dislike", authenticate, user.dislikeMission);

//post
router.post("/share/new", authenticate, user.sharePost);



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
