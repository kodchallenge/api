import { Model } from "sequelize"
import { SolutionCaseModel } from "../models";
import { SolutionModel } from "../models/solution.model";
import { Solution, SolutionCase } from "../types"

export class SolutionCaseRepository {
    public static async save({
        ...res
    }: Omit<SolutionCase, "id">): Promise<Model<SolutionCase, {}> | null> {
        // save solution
        const solution = await SolutionCaseModel.create({
            ...res
        });
        return solution;
    }

    // get by solution id
    public static async getBySolutionId(solutionId: number): Promise<SolutionCase[]> {
        const model = await SolutionCaseModel.findAll({
            where: {
                solutionId,
            }
        })
        return model?.map(x => x.toJSON()) as SolutionCase[];
    }
}