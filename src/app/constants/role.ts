export const Role = {
    ADMIN: "ADMIN",
    CLIENT: "USER",
    PROVIDER: "PROVIDER",
}

export type RoleType = typeof Role[keyof typeof Role];