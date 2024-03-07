const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const { USER_ALLOW_RANDOM, GENDERS } = require("../constant/appConstant");

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
    gender: { type: String, enum: GENDERS },
    location: { type: { id: String, name: String } },
    isCertified: { type: Boolean, default: false },
    lastLoggedIn: Date,
    randomRight: { type: Number, default: USER_ALLOW_RANDOM },
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
  const u = this.toObject();
  delete u.__v;
  return u;
};

const User = mongoose.model("User", UserSchema);
module.exports = User;
