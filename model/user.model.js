const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
    {
        username: { type: String, required: true },
        surname: { type: String, required: true },
        age: Number,
        email: { type: String, unique: true },
        password: String,
        birthday: String,
        profileImage: String,
        socialPlatform: {
            platformName: String,
            platformId: String,
            platformToken: String
        },
        lastLoggedIn: Date,
        roles: { type: String, enum: ['user', 'admin'], default: ["user"] },
        point: { type: Number, default: 0 },

    },
    {
        collection: "travel",
        timestamps: true,
    }
);

UserSchema.pre('save', async function (next) {
    const user = this;
    if (!user.isModified('password')) return next();
  
    try {
      const salt = await bcrypt.genSalt();
      user.password = await bcrypt.hash(user.password, salt);
      next();
    } catch (error) {
      return next(error);
    }
  });
  UserSchema.methods.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password);
  };
  
    UserSchema.methods.toJSON = function () {
        const food = this.toObject();
        delete food.__v;
        return food;
    };

const User = mongoose.model("Travel", UserSchema);
module.exports = User;
