const jwt = require("jsonwebtoken");
const User = require("../model/user.model");
const UserInfo = require("../model/userInfo.model.js");
const messages = require("../constant/messages.json");
const cloudinary = require("../helper/cloudinary.js");
const createHttpError = require("http-errors");
const { uniq } = require("lodash");
const {
  getCategoryDataWithId,
  userPoint,
  getToken,
  extractUserData,
  isValidEmail,
  isValidName,
  isValidUsername,
  isValidPassword,
  isValidDateFormat,
  isValidGender,
} = require("../utils/methods.js");
const {
  PER_PAGE,
  USER_ALLOW_DATA,
  USER_ALLOW_RANDOM,
} = require("../constant/appConstant.js");

const loginToken = async (req, res, next) => {
  const { token } = req.body;
  const user = jwt.decode(token, process.env.SECRET_KEY);
  return res.send(true);
};

// const getProfile = async (req, res, next) => {
//   const user = req.user;
//   try {
//     if (!user) return res.status(404).json({ message: "User not found" });

//     const completeMission = await getCategoryDataWithId(user.completeMission);
//     const currentMission = await getCategoryDataWithId(user.currentMission);
//     const failedMission = await getCategoryDataWithId(user.failedMission);
//     const point = userPoint({ completeMission, currentMission, failedMission });

//     const sendavaibleUser = {
//       _id: user._id,
//       username: user.username,
//       firstname: user.firstname,
//       lastname: user.lastname,
//       age: user.age,
//       email: user.email,
//       birthday: user.birthday,
//       profileImage: user.profileImage,
//       followers: user.followers,
//       friends: user.friends,
//       completeMission: completeMission,
//       currentMission: currentMission,
//       failedMission: failedMission,
//       point: point,
//       gender: user.gender,
//       randomRight: user.randomRight,
//       location: user.location,
//       socialPlatform: user.socialPlatform,
//     };
//     res.status(200).json(sendavaibleUser);
//   } catch (error) {
//     next(error);
//   }
// };

// Register a new user

// Login with an existing user
const login = async (req, res, next) => {
  const { emailOrUsername, password, accessToken } = req.body;

  try {
    if (accessToken) {
      const facebookUser = await User.findOne({
        socialPlatform: { platformToken: accessToken },
      });
      if (!facebookUser) {
        throw createHttpError(404, messages.user_not_found);
      }
      return res.json(facebookUser.socialPlatform.platformToken);
    }
    function isValidEmail(email) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailPattern.test(email);
    }
    let user;
    if (isValidEmail(emailOrUsername)) {
      user = await User.findOne({ email: emailOrUsername });
    } else {
      user = await User.findOne({ username: emailOrUsername });
    }
    if (!user) {
    }

    const passwordMatch = await user.comparePassword(password);
    if (!passwordMatch) {
      throw createHttpError(401, messages.incorrect_password);
    }

    const token = getToken(user);
    res.json({ token });
  } catch (error) {
    next(error);
  }
};

const addMission = async (req, res, next) => {
  try {
    const { mission } = req.body;
    const { _id, currentMission } = req.user;
    if (!mission) throw createHttpError(404, messages.empty_mission);
    if (currentMission?.length >= USER_ALLOW_RANDOM) {
      throw createHttpError(404, messages.max_current_mission);
    }
    if (currentMission.some((i) => i._id === mission._id)) {
      throw createHttpError(404, messages.mission_already_available);
    } else {
      if (!mission.category || !mission._id) {
        throw createHttpError(404, messages.mission_null);
      }
      const newMission = {
        id: mission._id,
        addedDate: Date.now(),
        category: mission.category,
      };
      const newCurrentMission = [...currentMission, newMission];
      const doc = await User.findById(_id);
      doc.currentMission = uniq(newCurrentMission);
      const result = await doc.save();
      if (!result) {
        throw createHttpError(404, messages.mission_save_failed);
      }
      res.status(200).json({ message: messages.mission_save_success });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const completemission = async (req, res, next) => {
  const { missionId } = req.body;
  const { _id, currentMission } = req.user;

  try {
    if (!missionId) {
      throw createHttpError(404, messages.id_required);
    } else if (!currentMission.some((i) => i.id === missionId)) {
      throw createHttpError(404, messages.mission_not_contain_data);
    } else {
      const newCurrentMission = currentMission.filter(
        (i) => i.id !== missionId
      );
      const findWillOldMission = currentMission.find((i) => i.id === missionId);
      const doc = await User.findById(_id);
      doc.currentMission = newCurrentMission;
      if (findWillOldMission !== null) {
        doc.completeMission.push({
          id: findWillOldMission.id,
          category: findWillOldMission.category,
          addedDate: findWillOldMission.addedDate,
          finishDate: null,
        });
      } else {
        throw createHttpError(404, messages.mission_null);
      }
      const result = await doc.save();
      if (!result) {
        throw createHttpError(404, messages.mission_delete_failed);
      }
      return res.status(200).json({
        message: messages.mission_add_complete,
      });
    }
  } catch (error) {
    next(error);
  }
};
const failedmission = async (req, res, next) => {
  const { missionId } = req.body;
  const { _id, currentMission } = req.user;
  try {
    if (!missionId) {
      throw createHttpError(404, messages.id_required);
    } else if (!currentMission.some((i) => i.id === missionId)) {
      throw createHttpError(404, messages.mission_not_contain_data);
    } else {
      const newCurrentMission = currentMission.filter(
        (i) => i.id !== missionId
      );
      const findWillOldMission = currentMission.find((i) => i.id === missionId);
      const doc = await User.findById(_id);
      doc.currentMission = newCurrentMission;
      if (findWillOldMission !== null) {
        const failedData = {
          id: findWillOldMission.id,
          addedDate: findWillOldMission.addedDate,
          category: findWillOldMission.category,
          finishDate: Date.now(),
        };
        doc.failedMission.push(failedData);
      } else {
        throw createHttpError(404, messages.mission_null);
      }
      const result = await doc.save();
      if (!result) {
        throw createHttpError(404, messages.mission_delete_failed);
      }
      return res.status(200).json({
        message: messages.mission_failed_complete,
      });
    }
  } catch (error) {
    next(error);
  }
};

const uploadProfile = async (req, res, next) => {
  const { _id } = req.user;
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      public_id: `${_id}_profile`,
      width: 500,
      height: 500,
      crop: "fill",
    });

    const updatedUser = await User.findByIdAndUpdate(
      _id,
      { profileImage: result.url },
      { new: true }
    );
    if (!updatedUser) throw createHttpError(404, "image failed");
    return res.send(true);
  } catch (error) {
    next(error);
  }
};
const getUserWithPage = async (req, res, next) => {
  const page = req.params.page || 1;
  const skip = (page - 1) * PER_PAGE;
  try {
    const users = await User.find({ roles: ["user"] }, USER_ALLOW_DATA)
      .skip(skip)
      .limit(PER_PAGE);
    if (!users) {
      return createHttpError(404, messages.user_not_found);
    }
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};
const getUsersWithSearch = async (req, res, next) => {
  const searchParam = req.params.searchParam;
  try {
    const users = await User.find(
      {
        $or: [
          { username: { $regex: searchParam, $options: "i" } }, // 'i' seçeneği büyük/küçük harf duyarlılığını kapatır
          { firstname: { $regex: searchParam, $options: "i" } },
          { lastname: { $regex: searchParam, $options: "i" } },
        ],
      },
      { score: { $meta: "textScore" }, ...USER_ALLOW_DATA }
    )
      .sort({ score: { $meta: "textScore" } })
      .limit(10);
    console.log(users);
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

//asıl methodlar bunlar olacak

const register = async (req, res, next) => {
  try {
    const {
      username,
      firstname,
      lastname,
      birthday,
      profileImage,
      gender,
      email,
      password,
    } = req.body;
    let errorMessage = [];
    if (!isValidEmail(email)) errorMessage.push("email_error");
    if (!isValidName(firstname)) errorMessage.push("firstname_error");
    if (!isValidName(lastname)) errorMessage.push("lastname_error");
    if (!isValidUsername(username)) errorMessage.push("username_error");
    if (!isValidPassword(password)) errorMessage.push("password_error");
    if (!isValidDateFormat(birthday)) errorMessage.push("birtday_error");
    if (!isValidGender(gender)) errorMessage.push("gender_error");

    if (errorMessage.length > 0) {
      throw createHttpError(400, errorMessage.toString());
    } else {
      const saveableData = {
        username: isValidUsername(username),
        firstname: isValidName(firstname),
        lastname: isValidName(lastname),
        birthday: isValidDateFormat(birthday),
        gender: isValidGender(gender),
        email: isValidEmail(email),
        password: isValidPassword(password),
        profileImage,
      };
      const user = new User(saveableData);
      const userInfo = new UserInfo({ user: user._id });
      if (!user && !userInfo) {
        throw createHttpError(400, "user_not_found");
      }
      await user.save();
      await userInfo.save();
      const token = getToken(user);
      res.json({ token: token });
    }
  } catch (error) {
    next(error);
  }
};

//Profile
const getProfile = async (req, res, next) => {
  // düzenlenecek
  try {
    const userData = extractUserData(req.user);
    const missions = await UserInfo.findOne({ user: userData._id });
    console.log(missions);
    const totalData = { ...userData, ...missions };
    res.status(200).json(totalData);
  } catch (error) {
    next(error);
  }
};
const userInfoUpdater = async (user, id, list, data) => {
  try {
    const { _id: userId } = user;
    const userInfo = await UserInfo.findOne({ user: userId });

    if (!userInfo) {
      throw createHttpError(400, "user_not_found");
    }

    let missionExists = userInfo[list].some((value) => value.id === id);

    if (missionExists) {
      throw createHttpError(400, `already_exists`);
    }

    const addedDate = new Date(); // Şu anın tarihini al
    const sendData = {
      id,
      ...data,
      addedDate,
    };

    userInfo[list].unshift(sendData);
    await userInfo.save();

    return userInfo;
  } catch (error) {
    throw error;
  }
};

const acceptMission = async (req, res, next) => {
  try {
    const { _id: missionId, category } = req.body;
    const { _id: userId } = req.user;

    if (!missionId || !category) {
      throw createHttpError(400, "lost_info");
    }
    if (!userId) {
      throw createHttpError(400, "token_required");
    }

    const result = await userInfoUpdater(
      req.user,
      missionId,
      "activeMissions",
      { category }
    );

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getPastMission = async (req, res, next) => {
  try {
    const { _id: missionId, state } = req.body; // Silinecek görevin kimliği

    const { _id: userId } = req.user;
    if (!userId) createHttpError(400, "token_required");
    if (!missionId) createHttpError(400, "missionId_required");

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
        res.status(200).json({ message: "Mission deleted successfully" });
      } else {
        // Görev bulunamadı hatası
        createHttpError(404, "Mission not found");
      }
    } else {
      // Kullanıcı bulunamadı hatası
      createHttpError(404, "User not found");
    }
  } catch (error) {
    next(error);
  }
};

const acceptchallenge = async (req, res, next) => {
  try {
    const { _id: missionId, challengeType } = req.body;
    const { _id: userId } = req.user;

    if (!missionId || !challengeType) {
      throw createHttpError(400, "lost_info");
    }
    if (!userId) {
      throw createHttpError(400, "token_required");
    }

    const result = await userInfoUpdater(req.user, missionId, "challenges", {
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
    const { _id: missionId } = req.body; // Başarısız meydan okumanın kimliği

    const { _id: userId } = req.user;
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
    const { _id: userId } = req.user;
    let { page } = req.params;
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
    const { _id: userId } = req.user;
    const { id: challengeId } = req.body;

    // Kullanıcının sadece belirli challenge ID'ye sahip meydan okumasını getir
    const challenge = await UserInfo.findOne(
      { user: userId, "challenges.id": challengeId }, // Kullanıcının ID'si ve aranan challenge ID'si
      { "challenges.$": 1 } // Projeksiyon: Sadece aranan challenge'ı getir
    );

    if (!challenge || !challenge.challenges || challenge.challenges.length === 0) {
      throw createHttpError(404, "Challenge not found");
    }

    // İlgili challenge'ı istemciye gönder
    res.status(200).json(challenge.challenges[0]); // Çünkü $ projection, sadece bir öğe döndürecek
  } catch (error) {
    next(error);
  }
};

const setFav = async (req, res, next) => {};
const getFav = async (req, res, next) => {};
const getFavList = async (req, res, next) => {};

const setFriend = async (req, res, next) => {};
const getFriends = async (req, res, next) => {};
const getFriend = async (req, res, next) => {};
//mission

const favMission = async (req, res, next) => {};
const likeMission = async (req, res, next) => {};
const dislikeMission = async (req, res, next) => {};

//post
const sharePost = async (req, res, next) => {};

module.exports = {
  addMission,
  failedmission,
  completemission,
  loginToken,
  getUserWithPage,
  getUsersWithSearch,

  uploadProfile, //
  register, // okey
  login, // okey
  getProfile, // okey
  getPastMission, //okey
  favMission,
  likeMission,
  dislikeMission,
  sharePost,
  acceptMission, // okey
  getChallenges, // okey
  getFavList,
  getFriends,
  getchallenge, //okey
  getFav,
  getFriend,
  acceptchallenge, // okey
  setFav,
  setFriend,
  failedchallenge, // okey
  deletechallenge,
};
