import Sequelize, { ModelDefined } from "sequelize";
import { KcContext } from "../configs/db";
import { ProblemBaseCode } from "../types";

export const ProblemBaseCodeModel: ModelDefined<ProblemBaseCode, {}> = KcContext.define("base_codes", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    code: {
        type: Sequelize.STRING,
    },
}, { createdAt: false, updatedAt: false, deletedAt: false })
