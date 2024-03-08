// const User = require("../model/userModel.js");
const createHttpError = require("http-errors");
const Game = require("../model/game.model.js");
const likeItem = require("../utils/globals.js");

const getGames = async (req, res, next) => {
  try {
    const game = await Game.find({
      name: 1,
      point: 1,
      list: 1,
      list_two: 1,
      descriptions: 1,
    });
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
      const backupId = req.body._id;
      delete req.body._id;
      const game = await Game.findByIdAndUpdate(backupId, req.body, {
        new: true,
      });
      if (!game) {
        throw createHttpError(403, "Güncellenemedi");
      }
      return res.status(200).json({ message: "Güncellendi" });
    }
  } catch (e) {
    next(e);
  }
};

const likeGame = async (req, res, next) => {
  try {
    const { _id } = req.user;
    // Örnek olarak Game modeli üzerinde like işlemi yapalım
    const { gameId } = req.params; // Veya req.body içerisinden alınabilir
    const filter = { _id: gameId }; // Veya istediğiniz bir filtre
    const update = { $inc: { "meta.likes": 1 } }; // $inc operatörüyle like alanını 1 arttır

    const updatedGame = await likeItem(Game, filter, update);

    res.json(updatedGame);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getGames,
  getGame,
  saveGame,
  updateGame,
  likeGame,
};
