import Sequelize, { ModelDefined } from "sequelize";
import { KcContext } from "../configs/db";
import { Solution } from "../types";

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
    cases: {
        type: Sequelize.ARRAY(Sequelize.BOOLEAN),
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
}, { createdAt: false, updatedAt: false, deletedAt: false, underscored: true })
