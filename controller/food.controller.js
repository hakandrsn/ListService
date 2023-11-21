// const User = require("../model/userModel.js");
const createHttpError = require("http-errors");
const Food = require("../model/food.model.js");

const getAllFood = async (req, res, next) => {
  try {
    const food = await Food.find();
    if (!food) {
      throw createHttpError(404, "Work not found");
    } else {
      return res.status(200).json(food);
    }
  } catch (e) {
    return next(e);
  }
};

const getFood = async (req, res, next) => {
  console.log(req?.body);
  try {
    const food = await Food.find();
    if (!food) {
      throw createHttpError(500, "Work not found");
    } else {
      return res.status(500).json(food);
    }
  } catch (e) {
    return next(e);
  }
};
const getRandomFood = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};
const getFoodWithId = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};
const setFood = async (req, res, next) => {
  try {
    const food = new Food(req.body);
    const result = await food.save();
    if (!result) {
      throw createHttpError(404, "Yemek Yapılamadı");
    } else {
      return res.status(200).json(result);
    }
  } catch (e) {
    next(e);
  }
};

module.exports = {
  getAllFood,
  getFood,
  getRandomFood,
  getFoodWithId,
  setFood,
};
