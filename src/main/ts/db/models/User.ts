
export interface UserAttributes {
    username:string;
    password:string;
}

export interface UserInstance{
    id:number;
}

export class User implements UserAttributes{
    private _password: string;
    private _username: string;

    constructor(password: string, username: string) {
        this._password = password;
        this._username = username;
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