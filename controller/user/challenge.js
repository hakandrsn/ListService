const createHttpError = require("http-errors");
const User = require("../../model/user.model");
const UserInfo = require("../../model/userInfo.model.js");
const { userInfoUpdater } = require("./profile");

const acceptchallenge = async (req, res, next) => {
  try {
    const { _id: missionId, challengeType, userId } = req.body;

    if (!missionId || !challengeType) {
      throw createHttpError(400, "lost_info");
    }
    if (!userId) {
      throw createHttpError(400, "token_required");
    }

    const result = await userInfoUpdater(userId, missionId, "challenges", {
      challengeType,
    });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
const deletechallenge = async (req, res, next) => {}; // yapılmadı
const failedchallenge = async (req, res, next) => {
  try {
    const { _id: missionId, userId } = req.body; // Başarısız meydan okumanın kimliği
    if (!userId) createHttpError(400, "token_required");
    if (!missionId) createHttpError(400, "missionId_required");

    // Kullanıcı bilgisini bul
    const userInfo = await UserInfo.findOne({ user: userId });

    if (userInfo) {
      // Kullanıcının meydan okumaları içinde belirtilen meydan okumayı bul
      const challengeIndex = userInfo.challenges.findIndex(
        (challenge) => challenge.id === missionId
      );

      if (challengeIndex !== -1) {
        // Meydan okumanın durumunu false olarak ayarla
        userInfo.challenges[challengeIndex].state = "passive";

        // Değişiklikleri kaydet
        await userInfo.save();
        res.status(200).json({ message: "Challenge marked as failed" });
      } else {
        // Meydan okuma bulunamadı hatası
        createHttpError(404, "Challenge not found");
      }
    } else {
      // Kullanıcı bulunamadı hatası
      createHttpError(404, "User not found");
    }
  } catch (error) {
    next(error);
  }
};

const getChallenges = async (req, res, next) => {
  try {
    const { userId, page } = req.body;
    const PAGE_SIZE = 10; // Sayfa boyutu, isteğe bağlı olarak değiştirilebilir

    // Sayfa numarasını varsayılan olarak 1 olarak ayarla ve kontrol et
    page = page ? parseInt(page) : 1;
    if (isNaN(page) || page < 1) {
      page = 1;
    }

    // İlgili sayfadaki meydan okumalarını almak için başlangıç indeksini hesapla
    const startIndex = (page - 1) * PAGE_SIZE;

    // Kullanıcının meydan okumalarını bul ve belirli sayfadaki meydan okumalarını al
    const userInfo = await UserInfo.findOne({ user: userId }).populate({
      path: "challenges",
      options: { skip: startIndex, limit: PAGE_SIZE },
    });
    console.log(page, userInfo);
    if (userInfo) {
      // İlgili sayfadaki meydan okumalarını gönder
      res.status(200).json(userInfo.challenges);
    } else {
      // Kullanıcı bulunamadı hatası
      throw createHttpError(404, "User not found");
    }
  } catch (error) {
    next(error);
  }
};

const getchallenge = async (req, res, next) => {
  try {
    const { id: challengeId, userId } = req.body;

    // Kullanıcının sadece belirli challenge ID'ye sahip meydan okumasını getir
    const challenge = await UserInfo.findOne(
      { user: userId, "challenges.id": challengeId }, // Kullanıcının ID'si ve aranan challenge ID'si
      { "challenges.$": 1 } // Projeksiyon: Sadece aranan challenge'ı getir
    );

    if (
      !challenge ||
      !challenge.challenges ||
      challenge.challenges.length === 0
    ) {
      throw createHttpError(404, "Challenge not found");
    }

    // İlgili challenge'ı istemciye gönder
    res.status(200).json(challenge.challenges[0]); // Çünkü $ projection, sadece bir öğe döndürecek
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getChallenges,
  getchallenge,
  deletechallenge,
  failedchallenge,
  acceptchallenge,
};
