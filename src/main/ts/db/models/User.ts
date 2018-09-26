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

export default (sequelize: Sequelize.Sequelize): Sequelize.Model<UserInstance, UserAttributes> => {
    return sequelize.define<UserInstance, UserAttributes>("User", {
        username: Sequelize.STRING,
        password: Sequelize.STRING
    })
};