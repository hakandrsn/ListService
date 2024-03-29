const mongoose = require("mongoose");
const list = require("../constant/lists.json");
const Schema = mongoose.Schema;
const { comman_model } = require("./commonModel");
const ActivitySchema = new Schema(
  {
    ...comman_model,
    list: { type: [String], enum: list.activity_one },
    list_two: { type: [String], enum: list.activity_two },
    duration: Number,
    location: String,
    materialsNeeded: Array,
    skillLevel: {
      type: String,
      enum: list.skill_level,
      default: list.skill_level[0],
    },
    participants: { type: [Number], default: [1] },
    price: String,
    category: { type: String, default: "activity" },
  },
  {
    collection: "activity",
    timestamps: true,
  }
);

ActivitySchema.methods.toJSON = function () {
  const food = this.toObject();
  delete food.__v;
  return food;
};

const Activity = mongoose.model("Activity", ActivitySchema);
module.exports = Activity;
