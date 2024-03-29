import Sequelize, { ModelDefined } from "sequelize";
import { KcContext } from "../configs/db";
import { Problem } from "../types";
import { CategoryModel } from "./category.model";
import { ProblemBaseCodeModel } from "./problemBaseCode.model";
import { SolutionModel } from "./solution.model";

export const ProblemModel: ModelDefined<Problem, {}> = KcContext.define("problems", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    title: {
        type: Sequelize.STRING,
    },
    slug: {
        type: Sequelize.STRING,
    },
    description: {
        type: Sequelize.STRING,
    },
    io: {
        type: Sequelize.STRING,
        get: function() {
            return JSON.parse(this.getDataValue("io"))
        }
    },
    score: {
        type: Sequelize.INTEGER,
    },
    isPrivate: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        field: "is_private"
    },
    difficulty: {
        type: Sequelize.ENUM,
        values: ["easy", "normal", "hard"],
        defaultValue: "normal"
    },
    isDeleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        field: "is_deleted"
    },
    categoryId: {
        type: Sequelize.INTEGER,
        field: "category_id",
        defaultValue: 1
    }
}, { createdAt: false, updatedAt: false, deletedAt: false, underscored: true })

ProblemModel.hasMany(ProblemBaseCodeModel, {
    foreignKey: "problem_id",
})

ProblemModel.hasMany(SolutionModel, {
    foreignKey: "problem_id",
})
SolutionModel.belongsTo(ProblemModel, { foreignKey: "problem_id" })
