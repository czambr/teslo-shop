export interface User {
    id: string;
    name: string;
    email: string;
    emailVarified?: Date | null;
    password: string;
    role: string;
    image?: string | null;
}