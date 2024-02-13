const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../model/user.model");
const Game = require("../model/game.model");
const messages = require("../constant/messages.json");
const list = require("../constant/lists.json");
const Travel = require("../model/travel.model.js");
const Hobby = require("../model/hobby.model.js");
const Activity = require("../model/activity.model.js");
const Challenge = require("../model/challenge.model.js");
const Food = require("../model/food.model.js");

const createHttpError = require("http-errors");
const { uniq } = require("lodash");
const { getCategoryDataWithId, userPoint } = require("../utils/methods.js");

const getProfile = async (req, res, next) => {
  const user = req.user;
  try {
    if (!user) return res.status(404).json({ message: "User not found" });

    const completeMission = await getCategoryDataWithId(user.completeMission);
    const currentMission = await getCategoryDataWithId(user.currentMission);
    const failedMission = await getCategoryDataWithId(user.failedMission);
    const point = userPoint({ completeMission, currentMission, failedMission });

    const sendavaibleUser = {
      _id: user._id,
      username: user.username,
      firstname: user.firstname,
      lastname: user.lastname,
      age: user.age,
      email: user.email,
      birthday: user.birthday,
      profileImage: user.profileImage,
      followers: user.followers,
      friends: user.friends,
      completeMission: completeMission,
      currentMission: currentMission,
      failedMission: failedMission,
      point: point,
    };
    console.log(point);
    return res.status(200).json(sendavaibleUser);
  } catch (error) {
    next(error);
  }
};

// Register a new user
const register = async (req, res, next) => {
  const { password } = req.body;

  try {
    const user = new User(req.body);
    await user.save();
    res.json({ message: messages.registration_successful });
  } catch (error) {
    next(error);
  }
};

// Login with an existing user
const login = async (req, res, next) => {
  const { email, password, accessToken } = req.body;

  try {
    if (accessToken) {
      const facebookUser = await User.findOne({
        socialPlatform: { platformToken: accessToken },
      });
      if (!facebookUser) {
        return res.status(404).json({ message: messages.user_not_found });
      }
      return res.json(facebookUser.socialPlatform.platformToken);
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: messages.user_not_found });
    }

    const passwordMatch = await user.comparePassword(password);
    if (!passwordMatch) {
      return res.status(401).json({ message: messages.incorrect_password });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        fullname: `${user.firstname} ${user.lastname}`,
      },
      process.env.SECRET_KEY,
      {
        expiresIn: "5 days",
      }
    );
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
    if (currentMission?.length >= 3) {
      return res.status(206).json({ message: messages.max_current_mission });
    } else if (currentMission.some((i) => i._id === mission._id)) {
      return res
        .status(206)
        .json({ message: messages.mission_already_available });
    } else {
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
      return res.status(200).json({ message: messages.mission_save_success });
    }
  } catch (error) {
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

// const fixGameList = async (req, res, next) => {
//   try {
//     const allGames = await Game.find();
//     for (const game of allGames) {
//       const newList = [];
//       const newListTwo = [];
//       for (const constantItem of list.game_one) {
//         for (const dataItem of game.list_two) {
//           if (constantItem === dataItem) {
//             newListTwo.push(dataItem);
//           }
//         }
//       }

//       for (const constantItem of list.game_two) {
//         for (const dataItem of game.list) {
//           if (constantItem === dataItem) {
//             newList.push(dataItem);
//           }
//         }
//       }
//       // console.log(newList, newListTwo);
//       game.list = newListTwo;
//       game.list_two = newList;

//       await game.save();
//     }

//     console.log("Oyun listeleri başarıyla değiştirildi.");
//     res.send({ message: "Oyun listeleri başarıyla değiştirildi." });
//   } catch (error) {
//     next(error);
//   }
// };

const sharePostForFeed = async (req, res, next) => {};

module.exports = {
  register,
  login,
  addMission,
  getProfile,
  failedmission,
  completemission,
  // fixGameList,
};
