import { Request, Response } from "express";
import { SolutionRepository } from "../repositories";

export const saveSolution = async (req: Request, res: Response) => {
    const { code, score, cases, problemId } = req.body;
    //@ts-ignore
    const userId = req.user.id;
    console.log("USER ID ", userId)
    const solution = await SolutionRepository.save({
        cases,
        code,
        problemId,
        score,
        userId,
    })
    return res.status(200).json(solution);
}