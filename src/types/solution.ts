export interface Solution {
    id: number;
    userId: number;
    problemId: number;
    code: string;
    score: number;
    cases: boolean[];
    createdAt: Date;
}