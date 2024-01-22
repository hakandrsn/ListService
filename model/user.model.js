const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const UserSchema = new Schema(
  {
    username: { type: String, required: true },
    firstname: String,
    lastname: String,
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
    lastLoggedIn: Date,
    roles: { type: [String], enum: ["user", "admin"], default: ["user"] },
    point: { type: Number, default: 0 },
    followers: { type: Number, default: 0 },
    friends: { type: Number, default: 0 },
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
