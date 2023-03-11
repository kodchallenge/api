import Sequelize, { ModelDefined } from "sequelize";
import { KcContext } from "../configs/db";
import { User } from "../types";

export const UserModel: ModelDefined<User, {}> = KcContext.define("users", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    username: {
        type: Sequelize.STRING,
    },
    firstname: {
        type: Sequelize.STRING,
    },
    lastname: {
        type: Sequelize.STRING,
    },
    email: {
        type: Sequelize.STRING,
    },
    password: {
        type: Sequelize.INTEGER,
    },
    isVerified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        field: "is_verified"
    },
    isDeleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        field: "is_deleted"
    },
    createdAt: {
        type: Sequelize.TIME,
        field: "created_at"
    },
    deletedAt: {
        type: Sequelize.TIME,
        field: "deleted_at"
    },
    verifiedAt: {
        type: Sequelize.TIME,
        field: "verified_at"
    },
}, { createdAt: false, updatedAt: false, deletedAt: false, underscored: true })