import Sequelize, { ModelDefined } from "sequelize";
import { KcContext } from "../configs/db";
import { SolutionCase } from "../types";

export const SolutionCaseModel: ModelDefined<SolutionCase, {}> = KcContext.define("solution_cases", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    solutionId: {
        type: Sequelize.INTEGER,
        field: "solution_id",
    },
    caseIndex: {
        type: Sequelize.INTEGER,
        field: "case_index",
    },
    output: {
        type: Sequelize.STRING,
    },
    status: {
        type: Sequelize.BOOLEAN,
    },
    build: {
        type: Sequelize.BOOLEAN,
    },
    timeout: {
        type: Sequelize.BOOLEAN,
    },
}, { createdAt: false, updatedAt: false, deletedAt: false, underscored: true })
