// const User = require("../model/userModel.js");
const createHttpError = require("http-errors");
const Challenge = require("../model/challenge.model.js");

const getchallenges = async (req, res, next) => {
  try {
    const challenge = await Challenge.find();
    if (!challenge) {
      throw createHttpError(404, "Work not found");
    } else {
      return res.status(200).json(challenge);
    }
  } catch (e) {
    return next(e);
  }
};

const getchallenge = async (req, res, next) => {
  console.log(req?.body);
  try {
    const challenge = await Challenge.find(req.body._id);
    if (!challenge) {
      throw createHttpError(500, "Work not found");
    } else {
      return res.status(500).json(challenge);
    }
  } catch (e) {
    return next(e);
  }
};

const savechallenge = async (req, res, next) => {
  try {
    const challenge = new Challenge(req.body);
    const result = await challenge.save();
    if (!result) {
      throw createHttpError(404, "başarısız");
    } else {
      return res.status(200).json(result);
    }
  } catch (e) {
    next(e);
  }
};

const updatechallenge = async (req, res, next) => {
  try {
    if (req.body._id) {
      const backupId = req.body._id
      delete req.body._id
      const challenge = await Challenge.findByIdAndUpdate(backupId, req.body, { new: true });
      if (!challenge) {
        throw createHttpError(403, "Güncellenemedi");
      }
      return res.status(200).json({ message: "Güncellendi" });
    }
  } catch (e) {
    next(e);
  }
};

module.exports = {
  getchallenges,
  getchallenge,
  savechallenge,
  updatechallenge
};
