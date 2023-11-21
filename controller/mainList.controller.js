const createHttpError = require("http-errors");
const List = require("../model/mainList.model.js");

const addNewListItem = async (req, res, next) => {
  const { name, path } = req.body;
  try {
    const list = new List(req.body);
    const result =await list.save();
    if (!result) {
      throw createHttpError(400, "liste elemanı leklenemedi");
    } else {
      return res.status(200).json(result);
    }
  } catch (error) {
    next(error);
  }
};

const getList = async (req, res, next) => {
  try {
    const result =await List.find();
    if (!result) {
      throw createHttpError(400, "liste getirilemedi");
    } else {
      return res.status(200).json(result);
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addNewListItem,
  getList
};
