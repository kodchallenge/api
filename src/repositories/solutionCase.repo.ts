import { Model } from "sequelize"
import { SolutionCaseModel } from "../models";
import { SolutionModel } from "../models/solution.model";
import { Solution, SolutionCase } from "../types"

export class SolutionCaseRepository {
    public static async save({
        caseIndex,
        output,
        solutionId,
        status
    }: Omit<SolutionCase, "id">): Promise<Model<SolutionCase, {}> | null> {
        // save solution
        const solution = await SolutionCaseModel.create({
            caseIndex,
            output,
            solutionId,
            status
        });
        return solution;
    }
}