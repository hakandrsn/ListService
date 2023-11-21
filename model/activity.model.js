const mongoose = require("mongoose");
const {
  activity_types,
  activity_category,
} = require("../constant/model.types");
const Schema = mongoose.Schema;

const TypeSchema = new Schema({
  title: String,
});

const ActivitySchema = new Schema(
  {
    title: { type: String, required: true },
    descriptions: String,
    point: Number,
    meta: {
      likes: { type: Number, default: 0 },
      favs: { type: Number, default: 0 },
      dislikes: { type: Number, default: 0 },
    },
    type: { type: [String], enum: activity_types},
    category: { type: [String], enum: activity_category},
  },
  {
    collection: "activity",
    timestamps: true,
  }
);

ActivitySchema.methods.toJSON = function () {
  const food = this.toObject();
  delete food.__v;
  return food;
};

const Activity = mongoose.model("Activity", ActivitySchema);
module.exports = Activity;
