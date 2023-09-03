import { exec, execSync, spawn } from "child_process";
import { Request, Response } from "express";
import fse from "fs-extra";
import path from "path";
import { LanguageRepository, ProblemRepository, SolutionCaseRepository, SolutionRepository } from "../repositories";
import { SolutionCase, SolutionState } from "../types";
import terminal from "../utils/terminal";
import { compileCode } from "../apps/compiler";




// const compileCode = ({
//     path,
//     language,
//     args
// }: {
//     path: string,
//     language: string,
//     args: string
// }, outCB: (stdout: string | null, err: string | null, signal: NodeJS.Signals | null) => void) => {
//     const kcompiler = spawn('kcompiler', [`--path=${path}`, `--language=${language}`, `--args=${args}`])
//     let timeoutId: any = 0;
//     let err = ''
//     kcompiler.stderr.on('data', (data) => {
//         err += data.toString()
//         kcompiler.kill("SIGINT")
//     })

//     let output = ''
//     kcompiler.stdout.on('data', (data) => {
//         output += data.toString()
//     })

//     kcompiler.on('close', (code, signal) => {
//         clearTimeout(timeoutId)
//         outCB(output.trim(), err.trim(), signal)
//     })

//     // set timeout
//     timeoutId = setTimeout(() => {
//         kcompiler.kill()
//     }, eval(process.env.CODE_RUN_TIMEOUT))
// }

export const runCode = async (req: Request, res: Response) => {
    try {
        const { code, language, userId, problemSlug }: {
            code: string,
            language: string,
            userId: number,
            problemSlug: string
        } = req.body;

        const problem = await ProblemRepository.getBySlug(problemSlug);
        if (!problem) {
            return res.json({ status: false, output: terminal.colorize("Problem bulunamadı", "ERROR") })
        }

        const problemPath = path.join(process.env.PROBLEMS_PATH ?? "", problemSlug, language);

        if (!fse.existsSync(problemPath)) {
            return res.json({ status: false, output: terminal.colorize("Henüz bu soruyu bu dilde çözemezsiniz!", "ERROR") })
        }

        const solutionPath = path.join(process.env.SOLUTION_PATH ?? "", userId.toString(), problemSlug, language);
        fse.copySync(problemPath, solutionPath, { overwrite: true })
        fse.writeFileSync(path.join(solutionPath, "solution." + language), code)

        const codeResult = await compileCode({
            solutionPath,
            language,
            cases: JSON.parse(problem.dataValues.io)
        })
        
        const languageId = (await LanguageRepository.getList()).find(x => x.slug === language)?.id ?? 0;
        const solution = await SolutionRepository.save({
            approved: false,
            code,
            problemId: problem.dataValues.id,
            score: 0,
            userId,
            languageId,
            state: codeResult.status,
        })
        if(!solution) {
            throw new Error("Solution is not saved")
        }
        const cases = codeResult.cases.map((x, i) => {
            return {
                ...x,
                solutionId: solution.dataValues.id,
                caseIndex: i
            }
        })
        // save cases
        await SolutionCaseRepository.saveMany(cases);

        return res.json({ status: true, id: solution.dataValues.id, cases: codeResult.cases })


    } catch(err: any) {
        console.error(err)
        return res.json({ status: false, message: "Sunucu taraflı hata oluştu." })
    }
}

// export const runTestCases = async (req: Request, res: Response) => {
//     const { solution: solutionId, index: caseIndex }: {
//         index: number,
//         solution: number
//     } = req.body;

//     const solution = await SolutionRepository.getById(solutionId);

//     if (!solution) {
//         return res.json({ status: false, message: "Çözüm bulunamadı" })
//     }
//     const language = solution.language.slug;

//     // @ts-ignore
//     const io = solution.problem.io[caseIndex] as { input: string, output: string };

//     if (!io) {
//         return res.json({ status: false, message: "Test case bulunamadı" })
//     }
//     console.log("IO: ", io)

//     console.error("PROBLEM: ", solution.problem.slug)
//     const problemPath = path.join(process.env.PROBLEMS_PATH ?? "", solution.problem.slug, language);

//     const solutionPath = path.join(process.env.SOLUTION_PATH ?? "", solution.userId + "", solution.problem.slug, language);

//     fse.copySync(problemPath, solutionPath, { overwrite: true })
//     fse.writeFile(path.join(solutionPath, "solution." + language), solution.code)
//     compileCode({
//         args: io.input,
//         language,
//         path: solutionPath
//     }, async (output, err, signal) => {
//         const caseData: Omit<SolutionCase, "id"> = {
//             caseIndex,
//             output: output ?? "",
//             solutionId: solutionId,
//             status: true,
//             build: false,
//             timeout: false
//         }
//         if (err) {
//             caseData.status = false;
//             caseData.build = true;
//             caseData.output = err;
//         }
//         if (signal === "SIGTERM") {
//             caseData.status = false;
//             caseData.timeout = true;
//             caseData.output = "Timeout!";
//         }
//         if (output?.trim() !== io.output.trim()) {
//             caseData.status = false;
//         }
//         const _case = await SolutionCaseRepository.save(caseData)
//         res.status(200).json(_case)
//     })
// }