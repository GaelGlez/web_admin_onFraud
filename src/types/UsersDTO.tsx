export interface UsersDTO {
    id: number;
    full_name: string;
    email: string;
    password?: string;
}

export interface UpdateUserDTO {
    full_name?: string;
    email?: string;
    password?: string;
}
