const mongoose = require("mongoose");
const list = require("../constant/lists.json");
const { comman_model } = require("./commonModel");
const Schema = mongoose.Schema;

const GameSchema = new Schema(
  {
    ...comman_model,
    list_two: { type: [String], enum: list.game_one },
    list: { type: [String], enum: list.game_two },
    equipment: Array,
    skillLevel: { type: String, enum: list.skill_level, default: "beginner" },
    rules: Array,
    time: String,
    eventParticipants: { type: [Number], default: [1] },
  },
  {
    collection: "game",
    timestamps: true,
  }
);

GameSchema.methods.toJSON = function () {
  const food = this.toObject();
  delete food.__v;
  return food;
};

const Game = mongoose.model("Game", GameSchema);
module.exports = Game;
