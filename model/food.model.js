const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FoodSchema = new Schema(
  {
    foodName: { type: String, required: true, lowercase: true },
    prepareTime: { type: Number, required: true },
    description: { type: String, required: true },
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
