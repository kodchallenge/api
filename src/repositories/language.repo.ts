import { LanguageModel } from "../models";
import { Language } from "../types";

export class LanguageRepository {
    public static async getList(): Promise<Language[]> {
        return (await LanguageModel.findAll()).map(x => x.dataValues)
    }
}