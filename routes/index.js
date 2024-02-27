const Food = require("./food.router");
const Activity = require("./activity.router");
const Game = require("./game.router");
const Hobby = require("./hobby.router");
const Travel = require("./travel.router");
const Auth = require("./auth.router");
const User = require("./user.router");
const DailyRecommendation = require("./dailyRecommendation.router");
const Challenge = require("./challenge.router");
const Random = require("./random.router");

module.exports = {
  food: Food,
  activity: Activity,
  game: Game,
  hobby: Hobby,
  travel: Travel,
  auth: Auth,
  user: User,
  recommedation: DailyRecommendation,
  challenge: Challenge,
  random: Random,
};
