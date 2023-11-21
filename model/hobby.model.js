const mongoose = require("mongoose");
const { hobby_types, hobby_category } = require("../constant/model.types");
const Schema = mongoose.Schema;

const HobbySchema = new Schema(
  {
    title: { type: String, required: true },
    descriptions: String,
    point: Number,
    meta: {
      likes: Number,
      favs: Number,
      dislikes: Number,
    },
    type: { enum: hobby_types },
    category: { enum: hobby_category },
  },
  {
    collection: "hobby",
    timestamps: true,
  }
);

HobbySchema.methods.toJSON = function () {
  const food = this.toObject();
  delete food.__v;
  return food;
};

const Hobby = mongoose.model("Hobby", HobbySchema);
module.exports = Hobby;
