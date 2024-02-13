const Activity = require("../model/activity.model");
const Challenge = require("../model/challenge.model");
const Food = require("../model/food.model");
const Game = require("../model/game.model");
const Hobby = require("../model/hobby.model");
const Travel = require("../model/travel.model");

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

module.exports = {
  getCategoryDataWithId,
  userPoint,
};
