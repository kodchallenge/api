import { Request, Response } from "express";
import { SolutionRepository } from "../repositories";

export const saveSolution = async (req: Request, res: Response) => {
    const { code, language, problem } = req.body;
    //@ts-ignore
    const userId = req.user.id;
    const solution = await SolutionRepository.save({
        approved: false,
        code,
        problemId: problem,
        score: 0,
        userId,
        languageId: language
    })
    return res.status(200).json(solution);
}