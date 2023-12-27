const router = require("express").Router();
const game = require("../controller/game.controller");

router.get("/", game.getGames);
router.get("/:id", game.getGame)
router.post("/new", game.saveGame);
router.put("/update", game.updateGame);

module.exports = router;
