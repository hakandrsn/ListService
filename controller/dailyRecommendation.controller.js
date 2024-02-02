const createHttpError = require("http-errors");
const DailyRecommendation = require("../model/dailyRecommendation.model.js");

const getDailyRecommendation = async (req, res) => {
  try {
    const recommendationId = req.params.id;

    // Öneriyi veritabanından bul
    const recommendation = await DailyRecommendation.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "voters",
          foreignField: "_id",
          as: "votersInfo",
        },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          // Diğer öneri alanlarını da ekleyebilirsiniz
          "votersInfo.firstname": 1,
          "votersInfo.lastname": 1,
          "votersInfo.point": 1,
        },
      },
    ]);

    res.json({ message: "Oy başarıyla eklendi", recommendation });
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
