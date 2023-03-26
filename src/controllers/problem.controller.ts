import { NextFunction, Request, Response } from "express";
import { Model } from "sequelize";
import { ProblemRepository } from "../repositories";
import { Problem } from "../types";

//Helpers
const withIO = (problem: Model<Problem, {}> | null) => {
    if (!problem) return problem;
    const io = JSON.parse(problem.dataValues.io)
    problem.dataValues.io = "";
    return { ...problem.dataValues, totalCases: io.length }
}

//end Helpers

// Routes Methods
export const getProblems = async (req: Request, res: Response) => {
    const problems = await ProblemRepository.getList();
    res.json(problems)
}

export const getProblemById = async (req: Request<{ id: number }>, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const problem = await ProblemRepository.getById(id)
    res.json(withIO(problem))
}

export const getProblemBySlug = async (req: Request<{ slug: string }>, res: Response, next: NextFunction) => {
    const { slug } = req.params;
    const problem = await ProblemRepository.getBySlug(slug)
    res.json(withIO(problem))
}

export const getProblemByIdOrSlug = async (req: Request<{ id: number | string }>, res: Response, next: NextFunction) => {
    const { id } = req.params;
    let problem: Model<Problem, {}> | null = null;
    if (typeof id == "number") {
        problem = await ProblemRepository.getById(id)
    } else if (typeof id == "string") {
        problem = await ProblemRepository.getBySlug(id)
    }

    res.json(withIO(problem))
}