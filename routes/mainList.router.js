const router = require("express").Router();
const list = require("../controller/mainList.controller");

router.post("/add", list.addNewListItem);
router.get("/all", list.getList);

module.exports = router;
