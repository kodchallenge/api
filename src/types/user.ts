export interface User {
    id: number;
    username: string;
    password: string;
    email: string;
    firstname?: string | null;
    lastname?: string | null;
    isDeleted: boolean;
    isVerified: boolean;
    createdAt: Date;
    deletedAt?: Date | null;
    verifiedAt?: Date | null;
    avatar?: string | null;
    biography?: string | null;
    website?: string | null;
    location?: string | null;
    github?: string | null;
    twitter?: string | null;
    linkedin?: string | null;
    refreshToken?: string | null;
}