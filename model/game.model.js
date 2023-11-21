const mongoose = require("mongoose");
const { game_types, game_category } = require("../constant/model.types");
const Schema = mongoose.Schema;

const GameSchema = new Schema(
  {
    title: { type: String, required: true },
    descriptions: String,
    point: Number,
    meta: {
      likes: Number,
      favs: Number,
      dislikes: Number,
    },
    type: { enum: game_types },
    category: { enum: game_category },
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
