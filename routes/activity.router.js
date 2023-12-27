const router = require("express").Router();
const activity = require("../controller/activity.controller");

router.get("/", activity.getActivities);
router.get("/:id", activity.getActivity)
router.post("/new", activity.saveActivity);
router.put("/update", activity.updateActivity);

module.exports = router;
