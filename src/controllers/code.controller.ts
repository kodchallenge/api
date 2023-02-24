import { exec } from "child_process";
import { Request, Response } from "express";
import { mkdir } from "fs/promises";
import fse from "fs-extra";
import path from "path";

export const runCode = async (req: Request, res: Response) => {
    const { code, language, userId, problemSlug }: {
        code: string,
        language: string,
        userId: number,
        problemSlug: string
    } = req.body;

    const problemPath = path.join(process.env.PROBLEMS_PATH ?? "", problemSlug, language);
    
    const solutionPath = path.join(process.env.SOLUTION_PATH ?? "", userId.toString(), problemSlug, language);

    fse.copySync(problemPath, solutionPath, {overwrite: true})
    fse.writeFile(path.join(solutionPath, "solution." + language), code)
    exec(`kcompiler --path=${solutionPath} --language=${language}`, (err, stdout, stderr) => {
        if(stderr) {
            return res.json({status: false, output: stderr})
        }
        res.json({status: true, output: stdout})
    })
}