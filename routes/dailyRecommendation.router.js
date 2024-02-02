const router = require("express").Router();
const dailyRecommendation = require("../controller/dailyRecommendation.controller");

router.get("/", dailyRecommendation.getDailyRecommendation);
router.post("/new", dailyRecommendation.setDailyRecommendation);

module.exports = router;
