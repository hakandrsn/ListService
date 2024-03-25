const createHttpError = require("http-errors");
const DailyRecommendation = require("../model/dailyRecommendation.model.js");

const getDailyRecommendation = async (req, res) => {
  try {
    const recommendations = await DailyRecommendation.find()
      .populate("game")
      .populate("travel")
      .populate("hobby")
      .populate("activity")
      .populate("food")
      .populate("challenge")
      .populate({
        path: "voters",
        model: "User", // Voters alanının referans verdiği model
        select: "username firstname lastname", // Sadece istediğiniz alanları seçin
      })
      .exec();
    // Öneriyi veritabanından bul

    res.status(200).json(recommendations[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Sunucu hatası" });
  }
};

const setDailyRecommendation = async (req, res, next) => {
  try {
    const daily = new DailyRecommendation(req.body);
    const result = await daily.save();
    if (!result) {
      throw createHttpError(404, "Yemek Yapılamadı");
    } else {
      return res.status(200).json(result);
    }
  } catch (e) {
    next(e);
  }
};

module.exports = { getDailyRecommendation, setDailyRecommendation };
