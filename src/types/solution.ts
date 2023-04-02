export interface Solution {
    id: number;
    userId: number;
    problemId: number;
    languageId: number;
    code: string;
    score: number;
    createdAt: Date;
    approved: boolean;
    state: SolutionState;
}

export enum SolutionState {
    Success = "success",
    Failed = "failed",
    BuildError = "build-error",
    Timeout = "timeout"
}