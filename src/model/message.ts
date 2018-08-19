import {User} from "./User";

/**
 * @class Message
 * */
export class Message {
    /**
     * @class Message
     * @param user {User}
     * @param message {string}
     * */
    constructor(private user: User, private  message: string) {}
}