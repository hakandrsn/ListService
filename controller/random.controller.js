const createHttpError = require("http-errors");
const { getRandomModel } = require("../utils/methods");
const User = require("../model/user.model");

const randomActivity = async (req, res, next) => {
  const body = req.body;
  try {
    const randomGetterMethod = async () => {
      let randomAct = await getRandomModel(body);
      if (randomAct.length < 1) {
        return randomGetterMethod();
      }
      return randomAct;
    };
    let response = await randomGetterMethod();
    if (!response) {
      throw createHttpError(404, "random_can't_find");
    }
    const userRandomRight = await User.findByIdAndUpdate("", {
      $inc: { randomRight: -1 },
    });
    await userRandomRight.save();
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

module.exports = { randomActivity };
