const mongoose = require("mongoose");
const {
  skill_level,
  eventWithWho,
  eventLocation
} = require("../constant/model.types");
const Schema = mongoose.Schema;
const { comman_model } = require("./commonModel")

const ActivitySchema = new Schema(
  {
    ...comman_model,
    list: { type: [String], enum: eventLocation },
    list_two: { type: [String], enum: eventWithWho },
    duration: Number,
    location: String,
    materialsNeeded: Array,
    skillLevel: { type: String, enum: skill_level, default: "beginner" },
    participants: Number,
    price: String
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
