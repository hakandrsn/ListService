const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const UserSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    firstname: { type: String, index: true },
    lastname: { type: String, index: true },
    age: Number,
    email: { type: String, unique: true },
    password: String,
    birthday: String,
    profileImage: String,
    socialPlatform: {
      platformName: String,
      platformId: String,
      platformToken: String,
    },
    gender: String,
    location: { type: { id: String, name: String } },
    isCertified: { type: Boolean, default: false },
    randomRight: { type: Number, default: 5 },
    lastLoggedIn: Date,
    roles: { type: [String], enum: ["user", "admin"], default: ["user"] },
    point: {
      type: {
        expectedPoint: Number,
        complatePoint: Number,
        failedPoint: Number,
      },
      default: {
        expectedPoint: 0,
        complatePoint: 0,
        failedPoint: 0,
      },
    },
    friends: { type: Number, default: 0 },
    currentMission: [
      { id: String, addedDate: Date, category: String, finishDate: Date },
    ],
    completeMission: [
      { id: String, addedDate: Date, category: String, finishDate: Date },
    ],
    failedMission: [
      { id: String, addedDate: Date, category: String, finishDate: Date },
    ],
  },
  {
    collection: "users",
    timestamps: true,
  }
);

UserSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    next();
  } catch (error) {
    return next(error);
  }
});
UserSchema.methods.comparePassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    console.error("Password comparison error:", error);
    return false;
  }
};

UserSchema.methods.toJSON = function () {
  const food = this.toObject();
  delete food.__v;
  return food;
};

const User = mongoose.model("User", UserSchema);
module.exports = User;
