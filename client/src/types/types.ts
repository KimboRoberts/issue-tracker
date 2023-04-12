export type User = {
    username: string,
    password: string
}

export type UserHttpResponse = {
    data: [User]
}