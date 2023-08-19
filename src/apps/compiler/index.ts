import { exec, execSync } from "child_process";
import { SolutionState } from "../../types";


export interface ResultCase {
    input: string;
    expected: string;
    output: string;
    status: boolean;
    build: boolean;
    timeout: boolean;
}

export interface RunCodeResult {
    status: SolutionState;
    success: boolean;
    message: string;
    cases: ResultCase[];
}

export type CompileCodeProps = {
    solutionPath: string;
    language: string;
    cases: { input: string, output: string }[];
}

const commands: {
    [slug: string]: string
} = {
    js: "node main.js",
    ts: "ts-node main.ts",
    py: "python main.py",
    c: "gcc main.c solution.c -o solution && ./solution",
    cpp: "g++ main.cpp solution.cpp -o solution && ./solution",
}

export const compileCode = async ({
    solutionPath,
    language,
    cases
}: CompileCodeProps) => {
    const result: RunCodeResult = {
        success: false,
        status: SolutionState.Pending,
        message: "",
        cases: [],
    }
    try {
        const command = commands[language];
        if (!command) {
            throw new Error("This language is not supported")
        }
        // Build
        execSync(`docker run -t -d ${language}_app`);
        const container = execSync("docker ps -l -q").toString().trim();
        execSync(`docker cp ${solutionPath}/. ${container}:/app`);

        // Run
        const casesPromise = cases.map(async ({ input, output: expected }): Promise<ResultCase> => {
            return new Promise((resolve, reject) => {
                const caseResult: ResultCase = {
                    input,
                    expected,
                    output: "",
                    status: false,
                    build: false,
                    timeout: false
                }
                try {
                    const runExec = exec(`docker exec -i ${container} sh -c "cd /app && ${command} ${input}"`, (err, stdout, stderr) => {
                        if (stderr) {
                            caseResult.build = true;
                            caseResult.output = stderr//.split("Command failed: docker exec")[0]?.trim(); // Docker mesajlarını sil
                        } else {
                            caseResult.status = stdout.trim() === expected.trim();
                            caseResult.output = stdout.trim();
                        }
                        resolve(caseResult);
                    });
                    setTimeout(() => {
                        caseResult.timeout = true;
                        result.cases.push(caseResult);
                        resolve(caseResult);
                        runExec.kill();
                    }, 1000 * 60 * 5 / (cases.length + 1)); // 5 minutes / (cases.length + 1)
                } catch (err: any) {
                    caseResult.build = true;
                    caseResult.output = err.message;
                    resolve(caseResult);
                }
            })
        });

        result.cases = await Promise.all(casesPromise);
        result.status = SolutionState.Success;
        result.success = true;
    } catch (err: any) {
        result.message = err.message;
        result.status = SolutionState.Failed;
    }
    return result;
}