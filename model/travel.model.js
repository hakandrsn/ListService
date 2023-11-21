const mongoose = require("mongoose");
const { travel_types, travel_category } = require("../constant/model.types");
const Schema = mongoose.Schema;

const TravelSchema = new Schema(
  {
    title: { type: String, required: true },
    descriptions: String,
    point: Number,
    meta: {
      likes: Number,
      favs: Number,
      dislikes: Number,
    },
    type: { enum: travel_types },
    category: { enum: travel_category },
  },
  {
    collection: "travel",
    timestamps: true,
  }
);

TravelSchema.methods.toJSON = function () {
  const food = this.toObject();
  delete food.__v;
  return food;
};

const Travel = mongoose.model("Travel", TravelSchema);
module.exports = Travel;
