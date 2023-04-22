import Sequelize, { ModelDefined } from "sequelize";
import { KcContext } from "../configs/db";
import { Category } from "../types";
import { ProblemModel } from "./problem.model";

export const CategoryModel: ModelDefined<Category, {}> = KcContext.define("categories", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
    }
}, { createdAt: false, updatedAt: false })

ProblemModel.belongsTo(CategoryModel, { foreignKey: "category_id" })