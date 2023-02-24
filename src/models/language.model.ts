import Sequelize, { ModelDefined } from "sequelize";
import { KcContext } from "../configs/db";
import { Language } from "../types";
import { ProblemBaseCodeModel } from "./problemBaseCode.model";

export const LanguageModel: ModelDefined<Language, {}> = KcContext.define("languages", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
    },
    slug: {
        type: Sequelize.STRING,
    },
}, { createdAt: false, updatedAt: false, deletedAt: false })

LanguageModel.hasMany(ProblemBaseCodeModel, {
    foreignKey: "language_id",
})

ProblemBaseCodeModel.belongsTo(LanguageModel, { foreignKey: "language_id" })