const express = require("express");
const { authenticate } = require("../middleware/auth.mw");
const user = require("../controller/user");

const router = express.Router();

//Profile
router.get("/profile", authenticate, user.getProfile); // kullanıcı temel bilgileri ve missions lar gelecek
router.get("/profile/info/", authenticate, user.getProfileInfo);
router.get("/profile/challenges/:page", authenticate, user.getChallenges);
router.get("/profile/favlist/:page", authenticate, user.getFavList);
router.get("/profile/friends/:page", authenticate, user.getFriends);

router.get("/profile/challenge", authenticate, user.getchallenge);
router.get("/profile/fav", authenticate, user.getFav);
router.get("/profile/friend", authenticate, user.getFriend);

router.post("/challenge/accept", authenticate, user.acceptchallenge);
router.post("/challenge/failed", authenticate, user.failedchallenge);
router.post("/challenge/delete", authenticate, user.deletechallenge);

router.post("/profile/add_fav", authenticate, user.setFav);
router.post("/profile/add_friend", authenticate, user.setFriend);

//Mission
router.post("/mission/accept", authenticate, user.acceptMission); //missionId gidecek
router.post("/mission/past", authenticate, user.getPastMission);
router.post("/mission/fav", authenticate, user.favMission);
router.post("/mission/like", authenticate, user.likeMission);
router.post("/mission/dislike", authenticate, user.dislikeMission);

//post
router.post("/share/new", authenticate, user.sharePost);

router.get("/users/:page", authenticate, user.getUserWithPage);
router.get("/users/search/:searchParam", authenticate, user.getUsersWithSearch);

//random
router.post("/random/randomMission", authenticate, user.randomActivity);

module.exports = router;
