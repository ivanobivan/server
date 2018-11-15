import {UserAttributes} from "../models/User";

export class User implements UserAttributes {
    //todo what do I want to do with that static variable
    static ENTRY_NAME = "USER_ENTRY";
    username: string;
    password: string;
    uuid?: string;
    email?: string;
    provider?: string;
    socialId?: number;


    constructor(
        username: string,
        password: string,
        provider?: string,
        socialId?: number,
        email?: string,
    ) {
        this.username = username;1
        this.password = password;
        this.provider = provider;
        this.socialId = socialId;
        this.email = email;
    }
}
