const mongoose = require("mongoose");
const list = require("../constant/lists.json");
const Schema = mongoose.Schema;
const { comman_model } = require("./commonModel");

const TravelSchema = new Schema(
  {
    ...comman_model,
    list: { type: [String], enum: list.travel_one },
    destination: String, // hedef
    transportationType: String,
    activitiesPlanned: Array,
    category: { type: String, default: "travel" },
  },
  {
    collection: "travel",
    timestamps: true,
  }
);

TravelSchema.methods.toJSON = function () {
  const food = this.toObject();
  delete food.__v;
  return food;
};

const Travel = mongoose.model("Travel", TravelSchema);
module.exports = Travel;
