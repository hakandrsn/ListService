const mongoose = require("mongoose");
const { eventGameTypes, eventLocation } = require("../constant/model.types");
const { comman_model } = require("./commonModel")
const Schema = mongoose.Schema;

const GameSchema = new Schema(
  {
    ...comman_model,
    list_two: { type: [String], enum: eventGameTypes },
    list: { type: [String], enum: eventLocation },
    equipment: Array,
    level: Number,
    rules: Array,
    time: Number,
    eventParticipants: Number,
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
