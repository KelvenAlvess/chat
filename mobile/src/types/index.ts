export interface User {
    userId: number;
    username: string;
}

export interface AuthResponse {
    token : string;
    userId: number;
    username: string;
}