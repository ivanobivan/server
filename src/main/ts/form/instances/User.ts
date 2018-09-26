import {UserAttributes} from "../../db/models/User";

export class User implements UserAttributes {
    username: string;
    password: string;

    constructor(username: string, password: string) {
        this.username = username;
        this.password = password;
    }
}
