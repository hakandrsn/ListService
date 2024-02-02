const mongoose = require("mongoose");
const list = require("../constant/lists.json");
const Schema = mongoose.Schema;
const { comman_model } = require("./commonModel");

const ChallengeSchema = new Schema(
  {
    ...comman_model,
    list: { type: [String], enum: list.challenge_one },
    list_two: { type: [String], enum: list.challenge_two },

    destination: String, // hedef
    transportationType: String,
    activitiesPlanned: Array,
  },
  {
    collection: "travel",
    timestamps: true,
  }
);

ChallengeSchema.methods.toJSON = function () {
  const food = this.toObject();
  delete food.__v;
  return food;
};

const Challenge = mongoose.model("Challenge", ChallengeSchema);
module.exports = Challenge;
