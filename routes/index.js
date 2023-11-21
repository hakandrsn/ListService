const food_router = require("./food.router");
const list_router = require("./mainList.router");
const Activity = require("./activity.router");

module.exports = {
  food: food_router,
  list: list_router,
  activity: Activity,
};
