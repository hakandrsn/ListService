const mongoose = require("mongoose");
const { hobby_types, hobby_category } = require("../constant/model.types");
const Schema = mongoose.Schema;
const { comman_model } = require("./commonModel")

const HobbySchema = new Schema(
  {
    ...comman_model,
    type: { type: [String], enum: hobby_types },
    tools: Array,
    hobbyTime: Number,
    level: Number,
    numberOfParticipants: Number,
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
