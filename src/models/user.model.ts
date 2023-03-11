import Sequelize, { Model, ModelDefined } from "sequelize";
import { KcContext } from "../configs/db";
import { User } from "../types";
import bcrypt from "bcrypt";

export const UserModel: ModelDefined<User, {}> = KcContext.define("users", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
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
        type: Sequelize.STRING,
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
        type: Sequelize.DATE,
        field: "created_at"
    },
    deletedAt: {
        type: Sequelize.DATE,
        field: "deleted_at",
    },
    verifiedAt: {
        type: Sequelize.DATE,
        field: "verified_at"
    },
}, {
    createdAt: false,
    updatedAt: false,
    deletedAt: false,
    underscored: true,
    hooks: {
        beforeCreate: (user: Model<User>) => {
            const salt = bcrypt.genSaltSync(10, "a");
            //@ts-ignore
            user.password = bcrypt.hashSync(user.password, salt);
        },
        beforeUpdate: (user: Model<User>) => {
            const salt = bcrypt.genSaltSync(10, "a");
            //@ts-ignore
            user.password = bcrypt.hashSync(user.password, salt);
        },
    },
})

UserModel.prototype.comparePassword = async function (password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
}