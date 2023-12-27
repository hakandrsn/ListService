const mongoose = require("mongoose");
const {
  activity_types,
  skill_level,
} = require("../constant/model.types");
const Schema = mongoose.Schema;
const { comman_model } = require("./commonModel")

const TypeSchema = new Schema({
  title: String,
});

const ActivitySchema = new Schema(
  {
    ...comman_model,
    type: { type: [String], enum: activity_types },
    duration: Number,
    location: String,
    materialsNeeded:Array,
    skillLevel:{enum:skill_level},
    participants:Number,
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
