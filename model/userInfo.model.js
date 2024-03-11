const mongoose = require("mongoose");
const { USER_ALLOW_RANDOM } = require("../constant/appConstant");
const Schema = mongoose.Schema;

const activeMissionSchema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true,
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
});

const pastMissionSchema = new Schema({
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
    enum: ["complete", "failed"],
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

const challengeSchema = new Schema({
  id: {
    type: String,
    required: true,
  },
  addedDate: {
    type: Date,
    required: true,
  },
  challengeType: {
    type: String,
    required: true,
    enum: ["daily", "weekly", "monthly", "yearly"],
  },
  state: {
    type: String,
    required: true,
    enum: ["active", "passive"],
    default: "active",
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
    activeMissions: [activeMissionSchema],
    pastMissions: [pastMissionSchema],
    challenges: [challengeSchema],
    myFavList: [myFavListSchema],
  },
  {
    collection: "userInfos",
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
