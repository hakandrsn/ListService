const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../model/user.model");
const Game = require("../model/game.model");

const createHttpError = require("http-errors");

const getProfile = async (req, res, next) => {
  const user = req.user;
  try {
    if (!user) return res.status(404).json({ message: "User not found" });
    const userPoint = () => {
      let expectedPoint = 0;
      let completePoint = 0;
      let failedPoint = 0;

      const processMissionPoints = (missionList) => {
        for (const mission of missionList) {
          if (mission.point && typeof mission.point === "number") {
            return mission.point;
          }
        }
        return 0;
      };

      expectedPoint += processMissionPoints(user.currentMission);
      completePoint += processMissionPoints(user.completeMission);
      failedPoint += processMissionPoints(user.failedMission);

      return {
        expectedPoint,
        completePoint,
        failedPoint,
      };
    };

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
      completeMission: user.completeMission,
      currentMission: user.currentMission,
      failedMission: user.failedMission,
      point: userPoint(),
    };

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
    res.json({ message: "Registration successful" });
  } catch (error) {
    next(error);
  }
};

// Login with an existing user
const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const passwordMatch = await user.comparePassword(password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Incorrect password" });
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
    if (!mission) return res.status(404).json({ message: "empty_mission" });
    if (currentMission.length >= 3) {
      return res.status(206).json({ message: "max_current_mission" });
    } else if (currentMission.some((i) => i._id === mission._id)) {
      return res.status(206).json({ message: "mission_already_available" });
    } else {
      const newMission = { ...mission, addedDate: Date.now() };
      const newCurrentMission = [...currentMission, newMission];
      const doc = await User.findById(_id);
      doc.currentMission = newCurrentMission;
      const result = await doc.save();
      if (!result) {
        return res.status(410).json({ message: "mission_save_failed" });
      }
      return res.status(200).json({ message: "mission_save_success" });
    }
  } catch (error) {
    next(error);
  }
};

const deleteMission = async (req, res, next) => {
  try {
    const { missionId, status } = req.body;
    const { _id, currentMission } = req.user;

    if (!missionId) {
      return res.status(404).json({ message: "id_required" });
    } else if (!currentMission.some((i) => i._id === missionId)) {
      return res.status(404).json({ message: "mission_not_contain_data" });
    } else {
      const newCurrentMission = currentMission.filter(
        (i) => i._id !== missionId
      );
      const findWillOldMission = currentMission.find(
        (i) => i._id === missionId
      );
      const doc = await User.findById(_id);
      doc.currentMission = newCurrentMission;
      if (findWillOldMission !== null) {
        if (status === "complete") {
          doc.completeMission.push(findWillOldMission);
        } else if (status === "failed") {
          doc.failedMission.push(findWillOldMission);
        }
      } else {
        return res.status(500).json({ message: "mission_null" });
      }
      const result = await doc.save();
      if (!result) {
        return res.status(500).json({ message: "mission_delete_failed" });
      }
      return res.status(500).json({
        message:
          status === "complete" ? "mission_add_complete" : "mission_add_failed",
      });
    }
  } catch (error) {
    next(error);
  }
};

const randomResult = async (req, res, next) => {
  // try {
  //   const { mainPath, list_one, list_two } = req.body;
  //   if (mainPath) {
  //     if (mainPath === GAME) {
  //       if(list_one && list_two) {
  //         const randomGame = await Game.findRandom
  //       }
  //     }
  //   }
  // } catch (error) {
  //   next(error);
  // }
};

module.exports = {
  register,
  login,
  addMission,
  deleteMission,
  getProfile,
  // randomResult,
};
