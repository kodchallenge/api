import Sequelize, { ModelDefined } from "sequelize";
import { KcContext } from "../configs/db";
import { Solution, SolutionState } from "../types";
import { SolutionCaseModel } from "./solutionCase.model";

export const SolutionModel: ModelDefined<Solution, {}> = KcContext.define("solutions", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    code: {
        type: Sequelize.STRING,
    },
    score: {
        type: Sequelize.INTEGER,
    },
    createdAt: {
        type: Sequelize.DATE,
        field: "created_at",
        defaultValue: Sequelize.NOW,
    },
    userId: {
        type: Sequelize.INTEGER,
        field: "user_id",
    },
    problemId: {
        type: Sequelize.INTEGER,
        field: "problem_id",
    },
    languageId: {
        type: Sequelize.INTEGER,
        field: "language_id",
    },
    approved: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
    },
    state: {
        type: Sequelize.ENUM,
        values: Object.values(SolutionState),
    }
}, { createdAt: false, updatedAt: false, deletedAt: false, underscored: true })


// relations
SolutionModel.hasMany(SolutionCaseModel, {
    foreignKey: "solution_id",
})
