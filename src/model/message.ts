import {User} from "./User";
import {File} from "./File";

export interface IMessage {
    id: number,
    comment: string,
    updated: string,
    created: string,
    type: string,
    user: User,
    files: File[]
}

/**
 * @class Message
 * */
export class Message implements IMessage {

    id: number;
    comment: string;
    updated: string;
    created: string;
    type: string;
    user: User;
    files: File[];

    /**
     * @class Message
     * @param user {User}
     * @param comment {string}
     * @param id {number}
     * @param files {File[]}
     * @param created {string}
     * @param updated {string}
     * @param type {string}
     * */
    constructor(user: User,
                id: number,
                comment: string,
                files: File[],
                updated: string,
                created: string,
                type: string) {}
}