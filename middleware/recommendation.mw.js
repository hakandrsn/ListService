const schedule = require("node-schedule");
const { lists_name, food_one } = require("../constant/lists.json");
const DailyRecommendation = require("../model/dailyRecommendation.model.js");
const User = require("../model/user.model.js");
const Travel = require("../model/travel.model.js");
const Hobby = require("../model/hobby.model.js");
const Game = require("../model/game.model.js");
const Activity = require("../model/activity.model.js");
const Challenge = require("../model/challenge.model.js");
const Food = require("../model/food.model.js");

const recommendation = () => {
  // const rule = new schedule.RecurrenceRule();
  // rule.minute = 30;
  schedule.scheduleJob("0 22 * * *", async function () {
    try {
      const randomGame = await Game.aggregate([{ $sample: { size: 1 } }]);
      const randomActivity = await Activity.aggregate([
        { $sample: { size: 1 } },
      ]);
      const randomHobby = await Hobby.aggregate([{ $sample: { size: 1 } }]);
      const randomChllenge = await Challenge.aggregate([
        { $sample: { size: 1 } },
      ]);

      const randomTravel = await Travel.aggregate([{ $sample: { size: 1 } }]);
      const randomFoods = await Promise.all(
        food_one.map(async (category) => {
          const randomFood = await Food.aggregate([
            { $match: { list: category } },
            { $sample: { size: 1 } },
          ]);
          return randomFood[0]?._id;
        })
      );
      const randomDaily = {
        game: randomGame[0]?._id,
        activity: randomActivity[0]?._id,
        food: randomFoods,
        travel: randomTravel[0]?._id,
        hobby: randomHobby[0]?._id,
        challange: randomChllenge[0]?._id,
      };
      const rec = new DailyRecommendation(randomDaily);
      await rec.save();
      console.log("Daily recommendation created");
    } catch (error) {
      console.log("başarılamadı günlük seçici");
    }
  });
};

module.exports = recommendation;
