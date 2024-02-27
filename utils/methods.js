const Activity = require("../model/activity.model");
const Challenge = require("../model/challenge.model");
const Food = require("../model/food.model");
const Game = require("../model/game.model");
const Hobby = require("../model/hobby.model");
const Travel = require("../model/travel.model");
const jwt = require("jsonwebtoken");

const idless = (data) => {
  var filteredDictionary = data;
  filteredDictionary["_id"] = nil; // _id key-value pair is removed

  return filteredDictionary;
};

const getCategoryDataWithId = async (data) => {
  if (!data) return data;

  const result = await Promise.all(
    data.map(async (item) => {
      if (!item.category) return null;

      let itemData;
      switch (item.category) {
        case "game":
          itemData = await Game.findById(item.id);
          break;
        case "travel":
          itemData = await Travel.findById(item.id);
          break;
        case "activity":
          itemData = await Activity.findById(item.id);
          break;
        case "hobby":
          itemData = await Hobby.findById(item.id);
          break;
        case "food":
          itemData = await Food.findById(item.id);
          break;
        case "challenge":
          itemData = await Challenge.findById(item.id);
          break;
        default:
          itemData = null;
      }
      return itemData;
    })
  );
  return result.filter((item) => item !== null);
};

const userPoint = ({ completeMission, currentMission, failedMission }) => {
  let expectedPoint = 0;
  let completePoint = 0;
  let failedPoint = 0;

  const processMissionPoints = (missionList) => {
    let memoizePoint = 0;
    for (const mission of missionList) {
      if (mission.point && typeof mission.point === "number") {
        memoizePoint += mission.point;
      }
    }
    return memoizePoint;
  };

  expectedPoint = processMissionPoints(currentMission);
  completePoint = processMissionPoints(completeMission);
  failedPoint = processMissionPoints(failedMission);

  return {
    expectedPoint,
    completePoint,
    failedPoint,
  };
};

const getToken = (user) => {
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
  return token;
};

const getRandomModel = async (paths) => {
  let itemData;
  switch (paths.first) {
    case "game":
      if (paths.second && paths.third) {
        itemData = await Game.aggregate([
          { $match: { list: paths.second, list_two: paths.third } },
          { $sample: { size: 1 } },
        ]);
      } else {
        itemData = await Game.aggregate([{ $sample: { size: 1 } }]);
      }
      break;
    case "travel":
      if (paths.second && paths.third) {
        itemData = await Travel.aggregate([
          { $match: { list: paths.second } },
          { $sample: { size: 1 } },
        ]);
      } else {
        itemData = await Travel.aggregate([{ $sample: { size: 1 } }]);
      }
      break;
    case "activity":
      if (paths.second && paths.third) {
        itemData = await Activity.aggregate([
          { $match: { list: paths.second, list_two: paths.third } },
          { $sample: { size: 1 } },
        ]);
      } else {
        itemData = await Activity.aggregate([{ $sample: { size: 1 } }]);
      }
      break;
    case "hobby":
      if (paths.second && paths.third) {
        itemData = await Hobby.aggregate([
          { $match: { list: paths.second } },
          { $sample: { size: 1 } },
        ]);
      } else {
        itemData = await Hobby.aggregate([{ $sample: { size: 1 } }]);
      }
      break;
    case "food":
      if (paths.second && paths.third) {
        itemData = await Food.aggregate([
          { $match: { list: paths.second } },
          { $sample: { size: 1 } },
        ]);
      } else {
        itemData = await Food.aggregate([{ $sample: { size: 1 } }]);
      }
      break;
    case "challenge":
      if (paths.second && paths.third) {
        itemData = await Challenge.aggregate([
          { $match: { list: paths.second, list_two: paths.third } },
          { $sample: { size: 1 } },
        ]);
      } else {
        itemData = await Challenge.aggregate([{ $sample: { size: 1 } }]);
      }
      break;
    default:
      itemData = null;
  }
  return itemData;
};

module.exports = {
  getCategoryDataWithId,
  userPoint,
  getToken,
  getRandomModel,
};
