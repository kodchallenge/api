import Sequelize, { ModelDefined } from "sequelize";
import { KcContext } from "../configs/db";
import { ProblemBaseCode } from "../types";

export const ProblemBaseCodeModel: ModelDefined<ProblemBaseCode, {}> = KcContext.define("base_codes", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    code: {
        type: Sequelize.STRING,
    },
    problemId: {
        type: Sequelize.INTEGER,
        field: "problem_id",
    },
    languageId: {
        type: Sequelize.INTEGER,
        field: "language_id",
    }
}, { createdAt: false, updatedAt: false, deletedAt: false })
