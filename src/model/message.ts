import {User} from "./User";
import {File} from "./File";
import {Serializable} from "../Helper/Serializable";

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
export class MessageGoods extends Serializable implements IMessage {

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
     * */
    constructor() { super(); }
}

/**
 * @class MessageOrder
 * */
export class MessageOrder extends Serializable implements IMessage {

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
     * */
    constructor() { super(); }
}