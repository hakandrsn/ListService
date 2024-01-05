const comman_model = {
  name: { type: String, required: true, unique: true },
  descriptions: String,
  point: Number,
  meta: {
    likes: { type: Number, default: 0 },
    favs: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
  },
  image: { type: String, default: "" },
};

module.exports = {
  comman_model,
};
