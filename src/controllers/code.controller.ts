import { exec, spawn } from "child_process";
import { Request, Response } from "express";
import fse from "fs-extra";
import path from "path";
import { ProblemRepository, SolutionCaseRepository, SolutionRepository } from "../repositories";
import { SolutionCase } from "../types";

const compileCode = ({
    path,
    language,
    args
}: {
    path: string,
    language: string,
    args: string
}, outCB: (stdout: string | null, err: string | null, signal: NodeJS.Signals | null) => void) => {
    const kcompiler = spawn('kcompiler', [`--path=${path}`, `--language=${language}`, `--args=${args}`])
    let timeoutId: any = 0;
    let err = ''
    kcompiler.stderr.on('data', (data) => {
        err += data.toString()
        kcompiler.kill("SIGINT")
    })

    let output = ''
    kcompiler.stdout.on('data', (data) => {
        output += data.toString()
    })

    kcompiler.on('close', (code, signal) => {
        clearTimeout(timeoutId)
        outCB(output.trim(), err.trim(), signal)
    })

    // set timeout
    timeoutId = setTimeout(() => {
        kcompiler.kill()
    }, eval(process.env.CODE_RUN_TIMEOUT))
}

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

    compileCode({
        args,
        language,
        path: solutionPath
    }, (output, err, signal) => {
        if(err) {
            return res.json({ status: false, output: err })
        }
        if (signal === "SIGTERM") {
            return res.status(200).json({ status: false, output: "Timeout!" })
        }
        res.json({ status: true, output: output?.trim() })
    })
    // const kcompiler = spawn('kcompiler', [`--path=${solutionPath}`, `--language=${language}`, `--args=${args}`])
    // let timeoutId: any = 0;
    // kcompiler.stderr.on('data', (data) => {
    //     clearTimeout(timeoutId)
    //     //res.json({ status: false, output: data.toString().trim() })
    // })
    // let output = ''
    // kcompiler.stdout.on('data', (data) => {
    //     output += data.toString()
    // })

    // kcompiler.on('close', (code, signal) => {
    //     if(signal === "SIGTERM") {
    //         return res.status(200).json({ status: false, output: "Timeout!" })
    //     }
    //     clearTimeout(timeoutId)
    //     console.log("asld kaslşd kjalsşdk aşlsd kl")
    //     res.json({ status: true, output: output.trim() })
    // })

    // // set timeout
    // timeoutId = setTimeout(() => {
    //     kcompiler.kill("SIGTERM")
    // }, eval(process.env.CODE_RUN_TIMEOUT))
    // const kodCompilerPID = exec(`kcompiler --path=${solutionPath} --language=${language} --args=${args}`, (err, stdout, stderr) => {
    //     if (stderr) {
    //         return res.json({ status: false, output: stderr })
    //     }
    //     clearTimeout(timeoutId)
    //     res.json({ status: true, output: stdout.trim() })
    // }).pid
    // const timeoutId = setTimeout(() => {
    //     console.log("asldk aslkşdj lasşdjk lasşd ", kodCompilerPID)
    //     process.kill(kodCompilerPID ?? 0)
    //     res.json({ status: false, output: "Timeout!" })
    // }, eval(process.env.CODE_RUN_TIMEOUT))
}

export const runTestCases = async (req: Request, res: Response) => {
    const { solution: solutionId, index: caseIndex }: {
        index: number,
        solution: number
    } = req.body;

    const solution = await SolutionRepository.getById(solutionId);

    if (!solution) {
        return res.json({ status: false, message: "Çözüm bulunamadı" })
    }
    const language = solution.language.slug;

    // @ts-ignore
    const io = solution.problem.io[caseIndex] as { input: string, output: string };

    if (!io) {
        return res.json({ status: false, message: "Test case bulunamadı" })
    }
    console.log("IO: ", io)

    console.error("PROBLEM: ", solution.problem.slug)
    const problemPath = path.join(process.env.PROBLEMS_PATH ?? "", solution.problem.slug, language);

    const solutionPath = path.join(process.env.SOLUTION_PATH ?? "", solution.userId + "", solution.problem.slug, language);

    fse.copySync(problemPath, solutionPath, { overwrite: true })
    fse.writeFile(path.join(solutionPath, "solution." + language), solution.code)
    compileCode({
        args: io.input,
        language,
        path: solutionPath
    }, async (output, err, signal) => {
        const caseData: Omit<SolutionCase, "id"> ={
            caseIndex,
            output: output ?? "",
            solutionId: solutionId,
            status: true,
            build: false,
            timeout: false
        }
        if(err) {
            caseData.status = false;
            caseData.build = true;
            caseData.output = err;
        }
        if (signal === "SIGTERM") {
            caseData.status = false;
            caseData.timeout = true;
            caseData.output = "Timeout!";
        }
        const _case = await SolutionCaseRepository.save(caseData)
        res.status(200).json(_case)
    })

    // const kodCompilerPID = exec(`kcompiler --path=${solutionPath} --language=${language} --args=${io.input}`, async (err, stdout, stderr) => {
    //     stdout = stdout.trim();
    //     let status = true;
    //     if (stderr || stdout !== io.output) {
    //         status = false;
    //     }

    //     const _case = await SolutionCaseRepository.save({
    //         caseIndex,
    //         output: stdout,
    //         solutionId: solutionId,
    //         status,
    //         build: Boolean(stderr),
    //         timeout: false
    //     })
    //     clearTimeout(timeoutId)
    //     res.status(200).json(_case)
    // }).pid
    // const timeoutId = setTimeout(() => {
    //     console.log("asldk aslkşdj lasşdjk lasşd ")
    //     process.kill(kodCompilerPID ?? 0)
    //     const _case = SolutionCaseRepository.save({
    //         caseIndex,
    //         output: "Timeout",
    //         solutionId: solutionId,
    //         status: false,
    //         build: false,
    //         timeout: true
    //     })
    //     res.status(200).json(_case)
    // }, eval(process.env.CODE_RUN_TIMEOUT))
}