type AccountModel = {
    accountId: string,
    email: string | null,

    id?: string,
    photo?: string,
    firstName?: string,
    lastName?: string,
    role?: "Employee" | "Manager" | null
    loginWith?: "Google" | "Github" | "Default"
}

export default AccountModel;