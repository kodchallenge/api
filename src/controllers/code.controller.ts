import { exec } from "child_process";
import { Request, Response } from "express";
import { mkdir } from "fs/promises";
import fse from "fs-extra";
import path from "path";
import { ProblemRepository } from "../repositories";

export const runCode = async (req: Request, res: Response) => {
    const { code, language, userId, problemSlug }: {
        code: string,
        language: string,
        userId: number,
        problemSlug: string
    } = req.body;

    const problem = await ProblemRepository.getBySlug(problemSlug);
    if (!problem) {
        return res.json({ status: false, output: "Problem bulunamadı" })
    }

    const args = JSON.parse(problem.dataValues.io)[0].input;
    const problemPath = path.join(process.env.PROBLEMS_PATH ?? "", problemSlug, language);

    const solutionPath = path.join(process.env.SOLUTION_PATH ?? "", userId.toString(), problemSlug, language);

    fse.copySync(problemPath, solutionPath, { overwrite: true })
    fse.writeFile(path.join(solutionPath, "solution." + language), code)
    exec(`kcompiler --path=${solutionPath} --language=${language} --args=${args}`, (err, stdout, stderr) => {
        if (stderr) {
            return res.json({ status: false, output: stderr })
        }
        res.json({ status: true, output: stdout.trim() })
    })
}

export const runTestCases = async (req: Request, res: Response) => {
    const { code, language, userId, problemSlug, index: caseIndex }: {
        code: string,
        language: string,
        userId: number,
        problemSlug: string,
        index: number
    } = req.body;

    const problem = await ProblemRepository.getBySlug(problemSlug);
    if (!problem) {
        return res.json({ status: false, message: "Problem bulunamadı" })
    }
    const io = JSON.parse(problem.dataValues.io)[caseIndex] as { input: string, output: string };

    if (!io) {
        return res.json({ status: false, message: "Test case bulunamadı" })
    }

    const problemPath = path.join(process.env.PROBLEMS_PATH ?? "", problemSlug, language);

    const solutionPath = path.join(process.env.SOLUTION_PATH ?? "", userId.toString(), problemSlug, language);

    fse.copySync(problemPath, solutionPath, { overwrite: true })
    fse.writeFile(path.join(solutionPath, "solution." + language), code)
    exec(`kcompiler --path=${solutionPath} --language=${language} --args=${io.input}`, (err, stdout, stderr) => {
        stdout = stdout.trim();
        if (stderr || stdout !== io.output) {
            return res.json({ status: false })
        }
        res.json({ status: true })
    })
}