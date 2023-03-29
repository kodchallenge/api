import { exec } from "child_process";
import { Request, Response } from "express";
import { mkdir } from "fs/promises";
import fse from "fs-extra";
import path from "path";
import { ProblemRepository, SolutionCaseRepository, SolutionRepository } from "../repositories";

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
    const { solution: solutionId, index: caseIndex }: {
        index: number,
        solution: number
    } = req.body;

    const solution = await SolutionRepository.getById(solutionId);

    if(!solution) {
        return res.json({ status: false, message: "Çözüm bulunamadı" })
    }
    const language = solution.language.slug;

    const io = solution.problem.io[caseIndex] as { input: string, output: string };

    if (!io) {
        return res.json({ status: false, message: "Test case bulunamadı" })
    }
    console.log("IO: ", io)

    console.error("PROBLEM: ", solution.problem.slug)
    const problemPath = path.join(process.env.PROBLEMS_PATH ?? "", solution.problem.slug, language);

    const solutionPath = path.join(process.env.SOLUTION_PATH ?? "", solution.userId+"", solution.problem.slug, language);

    fse.copySync(problemPath, solutionPath, { overwrite: true })
    fse.writeFile(path.join(solutionPath, "solution." + language), solution.code)
    exec(`kcompiler --path=${solutionPath} --language=${language} --args=${io.input}`, async (err, stdout, stderr) => {
        stdout = stdout.trim();
        let status = true;
        if (stderr || stdout !== io.output) {
            status = false;
        }

        const _case = await SolutionCaseRepository.save({
            caseIndex,
            output: stdout,
            solutionId: solutionId,
            status
        })

        res.status(200).json(_case)
    })
}