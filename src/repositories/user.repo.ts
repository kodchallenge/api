import { Model } from "sequelize";
import { UserModel } from "../models";
import { User } from "../types";

export class UserRepository {
    public static async getList(): Promise<Model<User, {}>[]> {
        return UserModel.findAll()
    }
}