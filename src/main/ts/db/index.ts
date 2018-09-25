import Sequelize from "sequelize";
import {DBConfig} from "../config/config";

export interface DataBaseInterface {
    sequelize: Sequelize.Sequelize;

    checkConnection(): Promise<void>;
}

export class DataBase implements DataBaseInterface {

    private _sequelize: Sequelize.Sequelize;

    constructor() {
        this._sequelize = new Sequelize(
            DBConfig.DB_NAME,
            DBConfig.USERNAME,
            DBConfig.PASSWORD,
            {
                host: DBConfig.HOST,
                dialect: DBConfig.DIALECT,
                operatorsAliases: false,
                pool: {
                    max: 5,
                    min: 0,
                    acquire: 30000,
                    idle: 10000
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
}