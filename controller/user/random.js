const createHttpError = require("http-errors");
const { getRandomModel } = require("../../utils/methods");
const User = require("../../model/user.model");

const randomActivity = async (req, res, next) => {
  try {
    const body = req.body;
    const { _id: userId } = req.user;
    if (!userId) throw createHttpError(400, "Denied access");
    if (typeof body !== "object") throw createHttpError(400, "Type error");
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
    // const userRandomRight = await User.findById(userId);
    req.user.randomRight -= 1;
    await req.user.save();
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

module.exports = { randomActivity };