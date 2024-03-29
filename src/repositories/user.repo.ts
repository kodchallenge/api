import { Model, Op } from "sequelize";
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
            },
            attributes: { exclude: ["password"] },
        })
    }

    public static async getByUsername(username: string): Promise<Model<User, {}> | null> {
        return UserModel.findOne({
            where: {
                username,
                isDeleted: false,
                isVerified: true,
            },
            attributes: { exclude: ["password"] },
        })
    }

    public static async getByEmail(email: string): Promise<Model<User, {}> | null> {
        return UserModel.findOne({
            where: {
                email,
                isDeleted: false,
                isVerified: true,
            }
        })
    }

    public static async getByUsernameOrEmail(usernameOrEmail: string): Promise<Model<User, {}> | null> {
        return UserModel.findOne({
            where: {
                isDeleted: false,
                isVerified: true,
                [Op.or]: [
                    { username: usernameOrEmail },
                    { email: usernameOrEmail },
                ]
            },
        })
    }

    public static async create(user: Omit<User, "id">): Promise<Model<User, {}>> {
        return UserModel.create(user)
    }
    
    public static async getByRefreshToken(refreshToken: string): Promise<Model<User, {}> | null> {
        return UserModel.findOne({
            where: {
                refreshToken,
                isDeleted: false,
                isVerified: true,
            },
            attributes: { exclude: ["password"] },
        })
    }
}