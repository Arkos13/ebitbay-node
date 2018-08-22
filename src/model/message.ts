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
 * @class MessageGoods
 * */
export class MessageGoods implements IMessage {

    id: number;
    comment: string;
    updated: string;
    created: string;
    type: string;
    user: User;
    files: File[];
    goods_id: number;

    /**
     * @class Message
     * @param user {User}
     * @param comment {string}
     * @param id {number}
     * @param files {File[]}
     * @param created {string}
     * @param updated {string}
     * @param type {string}
     * @param goods_id {number}
     * */
    constructor(user: User,
                id: number,
                goods_id: number,
                comment: string,
                files: File[],
                updated: string,
                created: string,
                type: string) {}
}

/**
 * @class MessageOrder
 * */
export class MessageOrder implements IMessage {

    id: number;
    comment: string;
    updated: string;
    created: string;
    type: string;
    user: User;
    files: File[];
    order_id: number;

    /**
     * @class Message
     * @param user {User}
     * @param comment {string}
     * @param id {number}
     * @param files {File[]}
     * @param created {string}
     * @param updated {string}
     * @param type {string}
     * @param order_id {number}
     * */
    constructor(user: User,
                id: number,
                order_id: number,
                comment: string,
                files: File[],
                updated: string,
                created: string,
                type: string) {}
}