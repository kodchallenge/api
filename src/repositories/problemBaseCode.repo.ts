import { ProblemBaseCodeModel } from "../models";
import { ProblemBaseCode } from "../types";

export class ProblemBaseCodeRepository {
    public static async save(baseCode: Omit<ProblemBaseCode, "id">) {
        return ProblemBaseCodeModel.create(baseCode)
    }
}