const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const missionSchema = new Schema({
  id: {
    type: String,
    required: true,
  },
  addedDate: {
    type: Date,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  finishDate: {
    type: Date,
  },
  state: {
    type: String,
    required: true,
    enum: ["current", "complete", "failed"],
  },
});

const friendSchema = new Schema({
  id: {
    type: String,
    required: true,
  },
  addedDate: {
    type: Date,
    required: true,
  },
});

const challangeSchema = new Schema({
  id: {
    type: String,
    required: true,
  },
  addedDate: {
    type: Date,
    required: true,
  },
  challangeType: {
    type: String,
    required: true,
    enum: ["daily,weekly,monthly,yearly"],
  },
});

const myFavListSchema = new Schema({
  id: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ["food", "game", "travel", "hobby", "challange", "activity"],
  },
  addedDate: {
    type: Date,
    required: true,
  },
});

const UsersInfoSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    friends: [friendSchema],
    missions: [missionSchema],
    challanges: [challangeSchema],
    myFavList: [myFavListSchema],
  },
  {
    timestamps: true,
  }
);

UsersInfoSchema.methods.toJSON = function () {
  const ui = this.toObject();
  delete ui.__v;
  return ui;
};

const UsersInfo = mongoose.model("UsersInfo", UsersInfoSchema);
module.exports = UsersInfo;
