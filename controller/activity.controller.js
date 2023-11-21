const createHttpError = require("http-errors");
const Activity = require("../model/activity.model.js");

const getActivities = async (req, res, next) => {
  try {
    const activities = await Activity.find();
    if (!activities) {
      throw createHttpError(404, "Bulunamadı");
    }
    return res.status(200).json(activities);
  } catch (error) {}
};

const saveActivity = async (req, res, next) => {
  try {
    const activity = new Activity(req.body);
    const result = await activity.save();
    if (!result) {
      throw createHttpError(404, "Kaydedilemedi");
    }
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
const updateActivity = async (req, res, next) => {
  try {
    if (req.body._id) {
      const activity = await Activity.findByIdAndUpdate(req.body._id, req.body);
      if (!activity) {
        throw createHttpError(403, "Güncellenemedi");
      }
      return res.status(200).json({ message: "Güncellendi" });
    }
  } catch (e) {
    next(e);
  }
};

module.exports = {
  getActivities,
  saveActivity,
  updateActivity,
};
