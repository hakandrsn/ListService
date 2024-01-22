const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../model/user.model");

// Register a new user
const register = async (req, res, next) => {
  const { password } = req.body;

  try {
    const user = new User(req.body);
    await user.save();
    res.json({ message: "Registration successful" });
  } catch (error) {
    next(error);
  }
};

// Login with an existing user
const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const passwordMatch = await user.comparePassword(password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        fullname: `${user.firstname} ${user.lastname}`,
        age: user.age,
        email: user.email,
        image: profileImage
      },
      process.env.SECRET_KEY,
      {
        expiresIn: "5 days",
      }
    );
    res.json({ token });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login };
