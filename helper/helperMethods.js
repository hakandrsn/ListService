const Activity = require("../model/activity.model");
const Challenge = require("../model/challenge.model");
const Food = require("../model/food.model");
const Game = require("../model/game.model");
const Hobby = require("../model/hobby.model");
const Travel = require("../model/travel.model");

const selectModel = async (path) => {
  switch (path) {
    case "game":
      return Game;
    case "travel":
      return Travel;
    case "activity":
      return Activity;
    case "hobby":
      return Hobby;
    case "food":
      return Food;
    case "challenge":
      return Challenge;
    default:
      return null;
  }
};

module.exports = {
  selectModel,
};
