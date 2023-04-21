export interface Problem {
    id: number;
    title: string;
    slug: string;
    description: string;
    io: string;
    score: number;
    isPrivate: boolean;
    isDeleted: boolean;
    categoryId?: number;
}