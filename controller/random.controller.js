const createHttpError = require("http-errors");
const Activity = require("../model/activity.model");
const Challenge = require("../model/challenge.model");
const Food = require("../model/food.model");
const Game = require("../model/game.model");
const Hobby = require("../model/hobby.model");
const Travel = require("../model/travel.model");
const { getRandomModel } = require("../utils/methods");

const models = {
  game: Game,
  travel: Travel,
  hobby: Hobby,
  food: Food,
  challange: Challenge,
  activity: Activity,
};

const randomActivity = async (req, res, next) => {
  const body = req.body;
  try {
    const response = await getRandomModel(body);
    if (!response) {
      return createHttpError(404, "random_can't_find");
    }
  } catch (error) {
    next(error);
  }
  res.send(response);
  return true;
};

module.exports = { randomActivity };
