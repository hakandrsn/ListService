// const User = require("../model/userModel.js");
const createHttpError = require("http-errors");
const Challange = require("../model/challenge.model.js");

const getchallanges = async (req, res, next) => {
  try {
    const challange = await Challange.find();
    if (!challange) {
      throw createHttpError(404, "Work not found");
    } else {
      return res.status(200).json(challange);
    }
  } catch (e) {
    return next(e);
  }
};

const getchallange = async (req, res, next) => {
  console.log(req?.body);
  try {
    const challange = await Challange.find(req.body._id);
    if (!challange) {
      throw createHttpError(500, "Work not found");
    } else {
      return res.status(500).json(challange);
    }
  } catch (e) {
    return next(e);
  }
};

const savechallange = async (req, res, next) => {
  try {
    const challange = new Challange(req.body);
    const result = await challange.save();
    if (!result) {
      throw createHttpError(404, "başarısız");
    } else {
      return res.status(200).json(result);
    }
  } catch (e) {
    next(e);
  }
};

const updatechallange = async (req, res, next) => {
  try {
    if (req.body._id) {
      const backupId = req.body._id
      delete req.body._id
      const challange = await Challange.findByIdAndUpdate(backupId, req.body, { new: true });
      if (!challange) {
        throw createHttpError(403, "Güncellenemedi");
      }
      return res.status(200).json({ message: "Güncellendi" });
    }
  } catch (e) {
    next(e);
  }
};

module.exports = {
  getchallanges,
  getchallange,
  savechallange,
  updatechallange
};
