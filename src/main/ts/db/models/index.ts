import SequelizeStatic, {DataTypes, Model} from "sequelize";
import {DBConfig} from "../../config/config";
import Sequelize from "sequelize";
import {User, UserAttributes, UserInstance} from "./User";

export class DataBase {

    private _sequelize: Sequelize.Sequelize;
    private _model: Sequelize.Model<UserInstance, UserAttributes>;

    constructor() {
        const config = new DBConfig("test");
        this._sequelize = new SequelizeStatic(
            config.name,
            DBConfig.USERNAME,
            DBConfig.PASSWORD,
            {
                host: DBConfig.HOST,
                dialect: 'postgres',
                operatorsAliases: false,
                pool: {
                    max: 5,
                    min: 0,
                    acquire: 30000,
                    idle: 10000
                }
            });


        this._model = this.sequelize.define('Test', {
            username: {
                type: Sequelize.STRING
            },
            password: {
                type: Sequelize.STRING
            }
        });
    }

    checkConnection(): Promise<void> {
        return this.sequelize.authenticate();
    }

    get sequelize(): Sequelize.Sequelize {
        return this._sequelize;
    }

    set sequelize(value: Sequelize.Sequelize) {
        this._sequelize = value;
    }

    get model(): Sequelize.Model<UserInstance, UserAttributes> {
        return this._model;
    }

    set model(value: Sequelize.Model<UserInstance, UserAttributes>) {
        this._model = value;
    }
}