import {UserAttributes} from "../models/User";

export class User implements UserAttributes {
    //todo what do I want to do with that static variable
    static ENTRY_NAME = "USER_ENTRY";
    username: string;
    password: string;
    uuid?: string;

    constructor(username: string, password: string, uuid?: string) {
        this.username = username;
        this.password = password;
        this.uuid = uuid;
    }


}
