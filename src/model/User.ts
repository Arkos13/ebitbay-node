export interface IUser {
    id: number,
    username: string
}

/**
 * @class User
 * */
export class User implements IUser {
    id: number;
    username: string;

    /**
     * @class User
     * @param username {string}
     * @param id {number}
     * */
    constructor(username: string, id: number) {}
}