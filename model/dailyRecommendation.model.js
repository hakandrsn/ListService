const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DailyRecommedationSchema = new Schema(
  {
    votes: {
      type: Number,
      default: 0,
    },
    voters: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    game: { type: mongoose.Schema.Types.ObjectId, ref: "Game" },
    travel: { type: mongoose.Schema.Types.ObjectId, ref: "Travel" },
    hobby: { type: mongoose.Schema.Types.ObjectId, ref: "Hobby" },
    activity: { type: mongoose.Schema.Types.ObjectId, ref: "Activity" },
    food: [{ type: mongoose.Schema.Types.ObjectId, ref: "Food" }],
    challenge: { type: mongoose.Schema.Types.ObjectId, ref: "Challenge" },
  },
  {
    collection: "recommendation",
    timestamps: true,
  }
);

DailyRecommedationSchema.methods.toJSON = function () {
  const food = this.toObject();
  delete food.__v;
  return food;
};

const DailyRecommedation = mongoose.model(
  "DailyRecommedation",
  DailyRecommedationSchema
);
module.exports = DailyRecommedation;
