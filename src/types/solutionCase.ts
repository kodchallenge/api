export interface SolutionCase {
    id: number;
    solutionId: number;
    caseIndex: number;
    output: string;
    status: boolean;
    build: boolean;
    timeout: boolean;
}