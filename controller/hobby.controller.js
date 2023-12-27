// const User = require("../model/userModel.js");
const createHttpError = require("http-errors");
const Hobby = require("../model/hobby.model.js");

const getHobbies = async (req, res, next) => {
    try {
        const hobby = await Hobby.find();
        if (!hobby) {
            throw createHttpError(404, "Work not found");
        } else {
            return res.status(200).json(hobby);
        }
    } catch (e) {
        return next(e);
    }
};

const getHobby = async (req, res, next) => {
    console.log(req?.body);
    try {
        const hobby = await Hobby.find(req.body._id);
        if (!hobby) {
            throw createHttpError(500, "Work not found");
        } else {
            return res.status(500).json(hobby);
        }
    } catch (e) {
        return next(e);
    }
};

const saveHobby = async (req, res, next) => {
    try {
        const hobby = new Hobby(req.body);
        const result = await hobby.save();
        if (!result) {
            throw createHttpError(404, "Yemek Yapılamadı");
        } else {
            return res.status(200).json(result);
        }
    } catch (e) {
        next(e);
    }
};

const updateHobby = async (req, res, next) => {
    try {
        if (req.body._id) {
            const backupId = req.body._id
            delete req.body._id
            const hobby = await Hobby.findByIdAndUpdate(backupId, req.body, { new: true });
            if (!hobby) {
                throw createHttpError(403, "Güncellenemedi");
            }
            return res.status(200).json({ message: "Güncellendi" });
        }
    } catch (e) {
        next(e);
    }
};

module.exports = {
    getHobbies,
    getHobby,
    saveHobby,
    updateHobby
};
