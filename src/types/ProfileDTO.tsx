export interface ProfileDTO {
    id: number;
    email: string;
    full_name: string;
    password_hash: string;
    salt: string;
    role: boolean;
}

export interface UpdatePasswordDTO {
    oldPassword: string;
    newPassword: string;
}

export interface UpdateUserDTO {
    email?: string;
    full_name?: string;
}