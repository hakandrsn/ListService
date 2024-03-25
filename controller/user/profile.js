const User = require("../../model/user.model");
const UserInfo = require("../../model/userInfo.model.js");
const createHttpError = require("http-errors");
const cloudinary = require("../../helper/cloudinary.js");
const messages = require("../../constant/messages.json");
const {
  getToken,
  extractUserData,
  isValidEmail,
  isValidName,
  isValidUsername,
  isValidPassword,
  isValidDateFormat,
  isValidGender,
} = require("../../utils/methods.js");

const login = async (req, res, next) => {
  const { emailOrUsername, password, accessToken } = req.body;

  try {
    if (accessToken) {
      const facebookUser = await User.findOne({
        socialPlatform: { platformToken: accessToken },
      });
      if (!facebookUser) {
        throw createHttpError(404, messages.user_not_found);
      }
      return res.json(facebookUser.socialPlatform.platformToken);
    }
    function isValidEmail(email) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailPattern.test(email);
    }
    let user;
    if (isValidEmail(emailOrUsername)) {
      user = await User.findOne({ email: emailOrUsername });
    } else {
      user = await User.findOne({ username: emailOrUsername });
    }
    if (!user) {
    }

    const passwordMatch = await user.comparePassword(password);
    if (!passwordMatch) {
      throw createHttpError(401, messages.incorrect_password);
    }

    const token = getToken(user);
    res.json({ token });
  } catch (error) {
    next(error);
  }
};

const register = async (req, res, next) => {
  try {
    const { username, firstname, lastname, birthday, gender, email, password } =
      req.body;
    let errorMessage = [];
    if (!isValidEmail(email)) errorMessage.push("email_error");
    if (!isValidName(firstname)) errorMessage.push("firstname_error");
    if (!isValidName(lastname)) errorMessage.push("lastname_error");
    if (!isValidUsername(username)) errorMessage.push("username_error");
    if (!isValidPassword(password)) errorMessage.push("password_error");
    if (!isValidDateFormat(birthday)) errorMessage.push("birtday_error");
    if (!isValidGender(gender)) errorMessage.push("gender_error");

    if (errorMessage.length > 0) {
      throw createHttpError(400, errorMessage.toString());
    } else {
      const saveableData = {
        username: isValidUsername(username),
        firstname: isValidName(firstname),
        lastname: isValidName(lastname),
        birthday: isValidDateFormat(birthday),
        gender: isValidGender(gender),
        email: isValidEmail(email),
        password: isValidPassword(password),
      };
      const user = new User(saveableData);
      const userInfo = new UserInfo({ user: user._id });
      const result = await cloudinary.uploader.upload(req.file.path, {
        public_id: `${user._id}_profile`,
        width: 500,
        height: 500,
        crop: "fill",
      });
      if (!result) {
        throw createHttpError(400, "image_failed");
      }
      if (!user && !userInfo) {
        throw createHttpError(400, "user_not_found");
      }
      user.profileImage = result.url;
      await user.save();
      await userInfo.save();
      const token = getToken(user);
      res.json({ token: token });
    }
  } catch (error) {
    next(error);
  }
};

//Profile
const getProfile = async (req, res, next) => {
  // düzenlenecek
  try {
    const userData = extractUserData(req.user);
    if (!userData) throw createHttpError(404, "user_not_found");
    res.status(200).json(userData);
  } catch (error) {
    next(error);
  }
};

const getProfileInfo = async (req, res, next) => {
  try {
    const { _id } = req.user;
    if (!_id) throw createHttpError(404, "Access denied");
    const userInfos = await UserInfo.findOne({ user: _id });
    if (!userInfos) throw createHttpError(404, "userinfo_not_found");
    res.status(200).json(userInfos);
  } catch (error) {
    next(error);
  }
};
const userInfoUpdater = async (userInfo, id, list, data) => {
  try {
    if (!userInfo) {
      throw createHttpError(400, "user_not_found");
    }

    let missionExists = userInfo[list].some((value) => value.id === id);

    if (missionExists) {
      throw createHttpError(400, `already_exists`);
    }

    const addedDate = new Date();
    const sendData = {
      id,
      ...data,
      addedDate,
    };

    userInfo[list].unshift(sendData);
    await userInfo.save();

    return userInfo;
  } catch (error) {
    throw error;
  }
};

//bu sadece fotoğraf değişme olacak
const uploadProfile = async (req, res, next) => {
  const { _id } = req.user;
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      public_id: `${_id}_profile`,
      width: 500,
      height: 500,
      crop: "fill",
    });

    const updatedUser = await User.findByIdAndUpdate(
      _id,
      { profileImage: result.url },
      { new: true }
    );
    if (!updatedUser) throw createHttpError(404, "image failed");
    return res.send(true);
  } catch (error) {
    next(error);
  }
};
const getUserWithPage = async (req, res, next) => {
  const page = req.params.page || 1;
  const skip = (page - 1) * PER_PAGE;
  try {
    const users = await User.find({ roles: ["user"] }, USER_ALLOW_DATA)
      .skip(skip)
      .limit(PER_PAGE);
    if (!users) {
      return createHttpError(404, messages.user_not_found);
    }
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};
const getUsersWithSearch = async (req, res, next) => {
  const searchParam = req.params.searchParam;
  try {
    const users = await User.find(
      {
        $or: [
          { username: { $regex: searchParam, $options: "i" } }, // 'i' seçeneği büyük/küçük harf duyarlılığını kapatır
          { firstname: { $regex: searchParam, $options: "i" } },
          { lastname: { $regex: searchParam, $options: "i" } },
        ],
      },
      { score: { $meta: "textScore" }, ...USER_ALLOW_DATA }
    )
      .sort({ score: { $meta: "textScore" } })
      .limit(10);
    console.log(users);
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

const randomRightAdd = async (req, res, next) => {
  try {
    const { _id: userId } = req.user;
    if (!userId) throw createHttpError(400, "token_required");
    const userUpdate = await User.findByIdAndUpdate(userId, {
      $inc: { "randomRight": 1 },
    });
    if (!userUpdate) {
      throw createHttpError(400, "user cant update");
    }
    res.status(200).send({message:"You win new change"})
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
  register,
  getProfile,
  userInfoUpdater,
  uploadProfile,
  getUserWithPage,
  getUsersWithSearch,
  getProfileInfo,
  randomRightAdd,
};
