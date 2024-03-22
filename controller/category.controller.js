const createHttpError = require("http-errors");
const Activity = require("../model/activity.model");
const Challenge = require("../model/challenge.model");
const Food = require("../model/food.model");
const Game = require("../model/game.model");
const Hobby = require("../model/hobby.model");
const Travel = require("../model/travel.model");
const { concat } = require("lodash");

const getAllCategroy = async (req, res, next) => {
  try {
    const { _id } = req.user;
    if (!_id) throw createHttpError(400, "Access denied");

    const activities = await Activity.find();
    const challenges = await Challenge.find();
    const foods = await Food.find();
    const games = await Game.find();
    const hobies = await Hobby.find();
    const travels = await Travel.find();

    const categories = concat(
      activities,
      challenges,
      foods,
      games,
      hobies,
      travels
    );

    res.status(200).send(categories);
  } catch (error) {
    next(error);
  }
};
const getCategory = async (req, res, next) => {
  try {
    const { path } = req.params;
  } catch (error) {
    next(error);
  }
};
const getOneItem = async (req, res, next) => {};

module.exports = {
  getAllCategroy,
  getCategory,
  getOneItem,
};
