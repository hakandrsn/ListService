const createHttpError = require("http-errors");
const { userInfoUpdater } = require("./profile");
const UserInfo = require("../../model/userInfo.model.js");

const acceptMission = async (req, res, next) => {
  try {
    const { _id: missionId, category, userId } = req.body;

    if (!missionId || !category) {
      throw createHttpError(400, "lost_info");
    }
    if (!userId) {
      throw createHttpError(400, "token_required");
    }

    const result = await userInfoUpdater(userId, missionId, "activeMissions", {
      category,
    });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getPastMission = async (req, res, next) => {
  try {
    const { _id: missionId, state, userId } = req.body; // Silinecek görevin kimliği

    if (!userId) throw createHttpError(400, "token_required");
    if (!missionId) throw createHttpError(400, "missionId_required");

    // Kullanıcı bilgisini bul
    const userInfo = await UserInfo.findOne({ user: userId });

    if (userInfo) {
      // Kullanıcının aktif görevlerinde belirtilen görevi bul
      const index = userInfo.activeMissions.findIndex(
        (mission) => mission.id === missionId
      );

      if (index !== -1) {
        // Görevi listeden çıkar
        const failedMission = userInfo.activeMissions.splice(index, 1)[0];
        // Başarısız görevleri pasif görevler listesine ekle
        userInfo.pastMissions.push({
          addedDate: failedMission.addedDate,
          category: failedMission.category,
          id: failedMission.id,
          state,
          finishDate: new Date(),
        });
        // Değişiklikleri kaydet
        await userInfo.save();
        res.status(200).json({ message: `Mission ${state} successfully` });
      } else {
        // Görev bulunamadı hatası
        throw createHttpError(404, "Mission not found");
      }
    } else {
      // Kullanıcı bulunamadı hatası
      throw createHttpError(404, "User not found");
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  acceptMission,
  getPastMission,
};
