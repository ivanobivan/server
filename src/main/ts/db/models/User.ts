import Sequelize from "sequelize";

export interface UserAttributes {
    username: string;
    password: string;
    uuid?: string;
}

export interface UserInstance extends UserAttributes {
    id: number;
    createdAt: Date;
    updatedAt: Date;
}

export default (sequelize: Sequelize.Sequelize): Sequelize.Model<UserInstance, UserAttributes> => {
    return sequelize.define<UserInstance, UserAttributes>("User", {
        username: Sequelize.STRING,
        password: Sequelize.STRING,
        uuid: {
            type: Sequelize.UUID,
            primaryKey: true,
            defaultValue: () => {
                return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
                    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
                    return v.toString(16);
                });
            }
        }
    })
};