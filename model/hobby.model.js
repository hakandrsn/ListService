const mongoose = require("mongoose");
const list = require("../constant/lists.json");
const Schema = mongoose.Schema;
const { comman_model } = require("./commonModel");

const HobbySchema = new Schema(
  {
    ...comman_model,
    list: { type: [String], enum: list.hobby_one },
    tools: Array,
    hobbyTime: Number,
    level: Number,
    eventParticipants: Number,
  },
  {
    collection: "hobby",
    timestamps: true,
  }
);

HobbySchema.methods.toJSON = function () {
  const food = this.toObject();
  delete food.__v;
  return food;
};

const Hobby = mongoose.model("Hobby", HobbySchema);
module.exports = Hobby;
