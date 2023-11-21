const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MainListSchema = new Schema(
  {
    name: { type: String, required: true },
    path: { type: String, required: true, lowercase: true },
    image: { type: String },
    direction: { type: String },
  },
  { collection: "mainlist", timestamps: true }
);

MainListSchema.methods.toJSON = function () {
  const main = this.toObject();
  delete main.__v;
  return main;
};

const MainList = mongoose.model("MainList", MainListSchema);
module.exports = MainList;
