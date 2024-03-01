const createHttpError = require("http-errors");
const Activity = require("../model/activity.model");
const Challenge = require("../model/challenge.model");
const Food = require("../model/food.model");
const Game = require("../model/game.model");
const Hobby = require("../model/hobby.model");
const Travel = require("../model/travel.model");
const { getRandomModel } = require("../utils/methods");


const randomActivity = async (req, res, next) => {
  const body = req.body;
  try {
    const response = await getRandomModel(body);
    if (!response) {
      return createHttpError(404, "random_can't_find");
    }
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

module.exports = { randomActivity };
