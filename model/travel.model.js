const mongoose = require("mongoose");
const { eventTravellocation } = require("../constant/model.types");
const Schema = mongoose.Schema;
const { comman_model } = require("./commonModel")

const TravelSchema = new Schema(
  {
    ...comman_model,
    eventTravellocation: { type: [String], enum: eventTravellocation },
    destination: String, // hedef
    transportationType: String,
    activitiesPlanned: Array,
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
