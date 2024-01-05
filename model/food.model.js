const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { eventKind } = require("../constant/model.types");
const { comman_model } = require("./commonModel");

const FoodSchema = new Schema(
  {
    ...comman_model,
    list: { type: [String], enum: eventKind },
    ingredients: { type: [{ title: String, amount: String }] },
    prepareTime: { type: Number, required: true },
    cookingTime: Number,
    cookingMethod: String,
    serviceSize: Schema.Types.Mixed,
    caloricValue: Number,
  },
  { collection: "foods", timestamps: true }
);

FoodSchema.methods.toJSON = function () {
  const food = this.toObject();
  delete food.__v;
  return food;
};

const Food = mongoose.model("Food", FoodSchema);
module.exports = Food;
