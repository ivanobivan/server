import Sequelize from "sequelize";

export interface UserAttributes {
    username: string;
    password: string;
}

export interface UserInstance extends UserAttributes {
    id: number;
    createdAt: Date;
    updatedAt: Date;
}

export class User implements UserAttributes {
    private _username: string;
    private _password: string;


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


export default (sequelize: Sequelize.Sequelize):Sequelize.Model<UserInstance, UserAttributes> => {
    return sequelize.define<UserInstance, UserAttributes>("User", {
        username: Sequelize.STRING,
        password: Sequelize.STRING
    })
};