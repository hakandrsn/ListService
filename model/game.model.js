const mongoose = require("mongoose");
const { game_types, game_category, gameplay } = require("../constant/model.types");
const { comman_model } = require("./commonModel")
const Schema = mongoose.Schema;

const GameSchema = new Schema(
  {
    ...comman_model,
    type: { type: [String], enum: game_types },
    gameplay: { enum: gameplay },
    equipment: Array,
    level: Number,
    rules: Array,
    time: Number,
    numberOfParticipants: Number,
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
