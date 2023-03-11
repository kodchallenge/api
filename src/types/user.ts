export interface User {
    id: number;
    username: string;
    password: string;
    email: string;
    firstname: string;
    lastname: string;
    isDeleted: boolean;
    isVerified: boolean;
    createdAt: Date;
    deletedAt: Date;
    verifiedAt: Date;
}