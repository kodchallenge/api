import { Model } from "sequelize"
import { SolutionModel } from "../models/solution.model";
import { Solution } from "../types"

export class SolutionRepository {
    public static async save({
        userId,
        problemId,
        code,
        score,
        cases,
    }: Omit<Solution, "id" | "createdAt">): Promise<Model<Solution, {}> | null> {
        // save solution
        const solution = await SolutionModel.create({
            userId,
            problemId,
            code,
            score,
            cases,
        });
        return solution;
    }
}