// const User = require("../model/userModel.js");
const createHttpError = require("http-errors");
const Travel = require("../model/travel.model.js");

const getTravels = async (req, res, next) => {
    try {
        const travel = await Travel.find();
        if (!travel) {
            throw createHttpError(404, "Work not found");
        } else {
            return res.status(200).json(travel);
        }
    } catch (e) {
        return next(e);
    }
};

const getTravel = async (req, res, next) => {
    try {
        const travel = await Travel.find(req.body._id);
        if (!travel) {
            throw createHttpError(500, "Work not found");
        } else {
            return res.status(500).json(travel);
        }
    } catch (e) {
        return next(e);
    }
};

const saveTravel = async (req, res, next) => {
    try {
        const travel = new Travel(req.body);
        const result = await travel.save();
        if (!result) {
            throw createHttpError(404, "Yemek Yapılamadı");
        } else {
            return res.status(200).json(result);
        }
    } catch (e) {
        next(e);
    }
};

const updateTravel = async (req, res, next) => {
    try {
        if (req.body._id) {
            const backupId = req.body._id
            delete req.body._id
            const travel = await Travel.findByIdAndUpdate(backupId, req.body, { new: true });
            if (!travel) {
                throw createHttpError(403, "Güncellenemedi");
            }
            return res.status(200).json({ message: "Güncellendi" });
        }
    } catch (e) {
        next(e);
    }
};

module.exports = {
    getTravels,
    getTravel,
    saveTravel,
    updateTravel
};
