import Sequelize from "sequelize";

export interface UserAttributes {
    _username: string;
    _password: string;
}

export interface UserInstance extends UserAttributes {
    id: number;
    createdAt: Date;
    updatedAt: Date;
}

export default (sequelize: Sequelize.Sequelize): Sequelize.Model<UserInstance, UserAttributes> => {
    return sequelize.define<UserInstance, UserAttributes>("User", {
        _username: Sequelize.STRING,
        _password: Sequelize.STRING
    })
};