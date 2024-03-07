const USER_ALLOW_RANDOM = 5;
const PER_PAGE = 5;
const USER_ALLOW_DATA = {
  username: 1,
  firstname: 1,
  lastname: 1,
  profileImage: 1,
  birthday: 1,
  followers: 1,
  friends: 1,
};

const AVOID_WORDS = ["password", "123456", "qwerty", "abc123"];
const GENDERS = ["male", "female"];
module.exports = {
  PER_PAGE,
  USER_ALLOW_DATA,
  USER_ALLOW_RANDOM,
  AVOID_WORDS,
  GENDERS,
};
