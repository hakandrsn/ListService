const router = require("express").Router();
const game = require("../controller/game.controller");
const { authenticate } = require("../middleware/auth.mw");

router.get("/", authenticate, game.getGames);
router.get("/:id", authenticate, game.getGame);
router.post("/new", game.saveGame); //authenticate eklenmeli ilerde
router.post("/update", authenticate, game.updateGame);

router.post("/like/:gameId", authenticate, game.likeGame);
// router.post("/dislike", authenticate,game);
// router.get("/like_users", authenticate,game);
// router.get("/dislike_users", authenticate,game);

module.exports = router;
