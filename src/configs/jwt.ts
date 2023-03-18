import { Model } from "sequelize";
import { User } from "../types";
import jwt from "jsonwebtoken";
require("dotenv").config();

export const generateToken = (user: Model<User, {}>) => {
    return jwt.sign({ id: user.dataValues.id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
}
export const verifyToken = (token: string) => {
    return jwt.verify(token, process.env.JWT_SECRET);
}