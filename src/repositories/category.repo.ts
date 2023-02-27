import { Model } from "sequelize"
import { CategoryModel, ProblemModel } from "../models"
import { Category } from "../types"

export default class CategoryRepository {
    public static async getList(): Promise<Model<Category, {}>[]> {
        return CategoryModel.findAll()
    }
    public static async getById(id: number): Promise<Model<Category, {}> | null> {
        return CategoryModel.findByPk(id, {
            include: [{
                model: ProblemModel,
                attributes: ["title", "slug", "score", "id"],
                where: {
                    is_deleted: false,
                    is_private: false
                }
            }]
        })
    }
}