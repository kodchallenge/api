import { Model } from "sequelize"
import { LanguageModel, ProblemModel, SolutionCaseModel, UserModel } from "../models";
import { SolutionModel } from "../models/solution.model";
import { Language, Problem, Solution, SolutionState, User } from "../types"

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
    public static async approveWithScore(id: number, score: number, state: SolutionState): Promise<void> {
        await SolutionModel.update({
            score,
            approved: true,
            state
        }, { where: { id: id } })
    }

    public static async getApprovedSolutionsByUserId(userId: number): Promise<(Solution & { problem: Problem, language: Language })[]> {
        const models = await SolutionModel.findAll({
            where: {
                userId,
                approved: true,
            },
            include: [
                ProblemModel,
                LanguageModel,
                {
                    model: SolutionCaseModel,
                    as: "cases"
                }
            ],
            order: [
                ['id', 'DESC']
            ]
        })
        return models.map(model => model.toJSON() as (Solution & { problem: Problem, language: Language }));
    }

    public static async getProblemSolutionsByUserId(userId: number, problemId: number): Promise<(Solution & { problem: Problem, language: Language })[]> {
        const models = await SolutionModel.findAll({
            where: {
                userId,
                problemId,
                approved: true,
            },
            include: [
                LanguageModel,
                {
                    model: SolutionCaseModel,
                    as: "cases"
                }
            ],
            order: [
                ['id', 'DESC']
            ]
        })
        return models.map(model => model.toJSON() as (Solution & { problem: Problem, language: Language }));
    }
}