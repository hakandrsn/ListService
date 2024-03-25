const createHttpError = require("http-errors");
const { userInfoUpdater } = require("./profile");
const UserInfo = require("../../model/userInfo.model.js");
const { selectModel } = require("../../helper/helperMethods.js");
const User = require("../../model/user.model.js");

const acceptMission = async (req, res, next) => {
  try {
    const { _id: missionId, category } = req.body;
    const { _id: userId, randomRight } = req.user;

    if (!missionId || !category) {
      throw createHttpError(400, "lost_info");
    }
    if (!userId) {
      throw createHttpError(400, "token_required");
    }

    if (randomRight < 1) throw createHttpError(303, "go to profile for more.");

    const userInfo = await UserInfo.findOne({ user: userId });

    if(!userInfo) throw createHttpError(303,"User info not found")

    if (userInfo.activeMissions.length >= 3) {
      throw createHttpError(
        300,
        "You are at the maximum number of missions, finish before adding."
      );
    }
    if (!userInfo) {
      throw createHttpError(400, "user_not_found");
    }

    let missionExists = userInfo.activeMissions.some(
      (value) => value.id === id
    );

    if (missionExists) {
      throw createHttpError(400, `already_exists`);
    }

    const addedDate = new Date();
    const sendData = {
      id,
      ...data,
      addedDate,
    };

    userInfo.activeMissions.unshift(sendData);
    await userInfo.save();

    res.status(200).json(userInfo);
  } catch (error) {
    next(error);
  }
};

const getPastMission = async (req, res, next) => {
  try {
    const { _id: missionId, state } = req.body; // Silinecek görevin kimliği
    const { _id: userId } = req.user;

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
        if (state === "complete") {
          const Model = await selectModel(failedMission.category);
          const pathPoint = await Model.findOne(
            { _id: missionId },
            { point: 1 }
          );
          console.log(pathPoint.point);
          const userUpdate = await User.findByIdAndUpdate(userId, {
            $inc: { "point.missionPoint": pathPoint.point },
          });
          if (!userUpdate) {
            throw createHttpError(400, "user point can not added");
          }
        }

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
