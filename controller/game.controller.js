// const User = require("../model/userModel.js");
const createHttpError = require("http-errors");
const Game = require("../model/game.model.js");

const getGames = async (req, res, next) => {
  try {
    const game = await Game.find();
    if (!game) {
      throw createHttpError(404, "Work not found");
    } else {
      return res.status(200).json(game);
    }
  } catch (e) {
    return next(e);
  }
};

const getGame = async (req, res, next) => {
  console.log(req?.body);
  try {
    const game = await Game.find(req.body._id);
    if (!game) {
      throw createHttpError(500, "Work not found");
    } else {
      return res.status(500).json(game);
    }
  } catch (e) {
    return next(e);
  }
};

const saveGame = async (req, res, next) => {
  try {
    const game = new Game(req.body);
    const result = await game.save();
    if (!result) {
      throw createHttpError(404, "başarısız");
    } else {
      return res.status(200).json(result);
    }
  } catch (e) {
    next(e);
  }
};

const updateGame = async (req, res, next) => {
  try {
    if (req.body._id) {
      const backupId = req.body._id
      delete req.body._id
      const game = await Game.findByIdAndUpdate(backupId, req.body, { new: true });
      if (!game) {
        throw createHttpError(403, "Güncellenemedi");
      }
      return res.status(200).json({ message: "Güncellendi" });
    }
  } catch (e) {
    next(e);
  }
};

module.exports = {
  getGames,
  getGame,
  saveGame,
  updateGame
};
