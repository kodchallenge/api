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
}