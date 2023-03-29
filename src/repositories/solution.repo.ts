import { Model } from "sequelize"
import { LanguageModel, ProblemModel, UserModel } from "../models";
import { SolutionModel } from "../models/solution.model";
import { Language, Problem, Solution, User } from "../types"

export class SolutionRepository {
    public static async save({
        userId,
        problemId,
        languageId,
        code,
        score,
        approved,
    }: Omit<Solution, "id" | "createdAt">): Promise<Model<Solution, {}> | null> {
        // save solution
        const solution = await SolutionModel.create({
            userId,
            problemId,
            languageId,
            code,
            score,
            approved,
        });
        return solution;
    }

    public static async getById(id: number): Promise<Solution & { user: User, problem: Problem, language: Language } | null> {
        const model = await SolutionModel.findOne({
            where: {
                id,
            },
            include: [
                ProblemModel,
                LanguageModel,
                UserModel
            ]
        })
        return model?.toJSON() as (Solution & { user: User, problem: Problem, language: Language });
    }

    // approve solution and update model
    public static async approveWithScore(id: number, score: number): Promise<void> {
        await SolutionModel.update({
            score,
            approved: true,
        }, { where: { id: id } })
    }
}