export interface IAuthUser {
    needPasswordChange: boolean;
    email: string;
    name: string;
    role: string;
    image: string;
    status: string;
    isDeleted: boolean;
    emailVerified: boolean;
}

export interface ILoginPayload {
    email: string;
    password: string;
}

export interface IRegisterPayload {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    profilePhoto?: string;
    contactNumber?: string;
    address?: string;
}

export interface ILoginSuccessData {
    token: string;
    accessToken: string;
    refreshToken: string;
    user: IAuthUser;
}