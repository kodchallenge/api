import { Model } from "sequelize";
import { UserModel } from "../models";
import { User } from "../types";

export class UserRepository {
    public static async getList(): Promise<Model<User, {}>[]> {
        return UserModel.findAll()
    }

    public static async getById(id: number): Promise<Model<User, {}> | null> {
        return UserModel.findOne({
            where: {
                id,
                isDeleted: false,
                isVerified: true,
            }
        })
    }
}