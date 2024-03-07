const likeItem = async (Model, filter, update) => {
  try {
    // Model üzerinde güncelleme yap
    const updatedItem = await Model.findOneAndUpdate(filter, update, {
      new: true,
    });

    if (!updatedItem) {
      throw new Error("Item not found");
    }

    return updatedItem;
  } catch (error) {
    throw error;
  }
};

module.exports = likeItem;
