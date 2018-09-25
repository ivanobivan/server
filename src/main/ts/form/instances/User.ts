import {UserAttributes} from "../../db/models/User";

export class User implements UserAttributes {
    _username: string;
    _password: string;


    constructor(username: string, password: string) {
        this._username = username;
        this._password = password;
    }

    get password(): string {
        return this._password;
    }

    set password(value: string) {
        this._password = value;
    }

    get username(): string {
        return this._username;
    }

    set username(value: string) {
        this._username = value;
    }
}
