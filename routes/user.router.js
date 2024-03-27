const express = require("express");
const { authenticate } = require("../middleware/auth.mw");
const user = require("../controller/user");

const router = express.Router();

router.use(authenticate);
//Profile
router.get("/profile", user.getProfile); // kullanıcı temel bilgileri ve missions lar gelecek
router.get("/profile/info", user.getProfileInfo);
router.get("/profile/challenges/:page", user.getChallenges);
router.get("/profile/favlist/:page", user.getFavList);
router.get("/profile/friends/:page", user.getFriends);
router.post("/profile/randomRightAdd", user.randomRightAdd);

router.get("/profile/challenge", user.getchallenge);
router.get("/profile/fav", user.getFav);
router.get("/profile/friend", user.getFriend);

router.post("/challenge/accept", user.acceptchallenge);
router.post("/challenge/failed", user.failedchallenge);
router.post("/challenge/delete", user.deletechallenge);

router.post("/profile/add_fav", user.setFav);
router.post("/profile/add_friend", user.setFriend);

//Mission
router.post("/mission/accept", user.acceptMission); //missionId gidecek
router.post("/mission/past", user.getPastMission);
router.post("/mission/fav", user.favMission);
router.post("/mission/like", user.likeMission);
router.post("/mission/dislike", user.dislikeMission);

//post
router.post("/share/new", user.sharePost);

router.get("/users/:page", user.getUserWithPage);
router.get("/users/search/:searchParam", user.getUsersWithSearch);

//random
router.post("/random/randomMission", user.randomActivity);

module.exports = router;
