const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const list = require("../constant/lists.json");
const { comman_model } = require("./commonModel");

const FoodSchema = new Schema(
  {
    ...comman_model,
    list: { type: [String], enum: list.food_one },
    ingredients: { type: [{ title: String, amount: String }] },
    prepareTime: { type: Number, required: true },
    cookingTime: Number,
    cookingMethod: String,
    serviceSize: Schema.Types.Mixed,
    caloricValue: Number,
  },
  { collection: "food", timestamps: true }
);

FoodSchema.methods.toJSON = function () {
  const food = this.toObject();
  delete food.__v;
  return food;
};

const Food = mongoose.model("Food", FoodSchema);
module.exports = Food;
