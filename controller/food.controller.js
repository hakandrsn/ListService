// const User = require("../model/userModel.js");
const createHttpError = require("http-errors");
const Food = require("../model/food.model.js");

const getFoods = async (req, res, next) => {
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
    const food = await Food.find(req.body._id);
    if (!food) {
      throw createHttpError(500, "Work not found");
    } else {
      return res.status(500).json(food);
    }
  } catch (e) {
    return next(e);
  }
};

const saveFood = async (req, res, next) => {
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

const updateFood = async (req, res, next) => {
  try {
    if (req.body._id) {
      const backupId = req.body._id
      delete req.body._id
      const food = await Food.findByIdAndUpdate(backupId, req.body, { new: true });
      if (!food) {
        throw createHttpError(403, "Güncellenemedi");
      }
      return res.status(200).json({ message: "Güncellendi" });
    }
  } catch (e) {
    next(e);
  }
};

module.exports = {
  getFoods,
  getFood,
  saveFood,
  updateFood
};
