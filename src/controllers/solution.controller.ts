import { Request, Response } from "express";
import { ProblemRepository, SolutionCaseRepository, SolutionRepository } from "../repositories";
import { SolutionState } from "../types";

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
        languageId: language,
    })
    return res.status(200).json(solution);
}

export const approveSolution = async (req: Request, res: Response) => {
    const { problem: problemId } = req.body;
    const solutionId = parseInt(req.params.id);
    //@ts-ignore
    const userId = req.user.id;
    const solution = await SolutionRepository.getById(solutionId);

    if (!solution) {
        return res.status(400).json({ message: "Çözüm bulunamadı" })
    }

    if (solution.userId !== userId) {
        return res.status(403).json({ message: "Bu çözümü onaylayamazsınız" })
    }

    const cases = await SolutionCaseRepository.getBySolutionId(solutionId);
    const problem = await ProblemRepository.getById(problemId);
    if (!problem) {
        return res.status(400).json({ message: "Problem bulunamadı" })
    }

    let score = 0;
    for (const _case of cases) {
        if (_case.status) {
            score += problem.dataValues.score / cases.length;
        }
    }
    score = Math.round(score)
    let state: SolutionState = SolutionState.Success;
    for (const _case of cases) {
        if (_case.status) continue;
        if (_case.timeout) {
            state = SolutionState.Timeout;
            break;
        }
        if (_case.build) {
            state = SolutionState.BuildError;
            break;
        }
        state = SolutionState.Failed;
        break;
    }

    await SolutionRepository.approveWithScore(solutionId, score, state);
    return res.status(200).json({ status: true, message: "Çözümünüz Onaylandı 🎉" });
}

export const getApprovedSolutionsByUserId = async (req: Request, res: Response) => {
    const userId = parseInt(req.params.id);
    const solutions = await SolutionRepository.getApprovedSolutionsByUserId(userId);
    return res.status(200).json({
        solutions,
        status: true,
        message: "Çözümler başarıyla getirildi"
    });
}