import Sequelize, {and, col, FindOptions, fn, or, Transaction, where, WhereOptions} from "sequelize";
import {DBConfig} from "../config/config";
import {UserAttributes, UserInstance} from "./models/User";


export interface DataBaseInterface {
    sequelize: Sequelize.Sequelize;

    checkConnection(): void;

    createEntry<T, R>(model: Sequelize.Model<T, R>, instance: R): Promise<T>;

    getEntry<T, R>(uuid: string, model: Sequelize.Model<T, R>): Promise<T>;

    getAllEntries<T, R>(model: Sequelize.Model<T, R>): Promise<Array<T>>;

    deleteEntry<T, R>(uuid: string, model: Sequelize.Model<T, R>): Promise<T>;

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

    get sequelize(): Sequelize.Sequelize {
        return this._sequelize;
    }

    set sequelize(value: Sequelize.Sequelize) {
        this._sequelize = value;
    }

    checkConnection(): void {
        this.sequelize.authenticate()
            .then(res => {
                console.log("DB connection is successful")
            })
            .catch(err => {
                throw err;
            })
    }

    syncModel<T, R>(model: Sequelize.Model<T, R>): void {
        model.sync()
            .then(res => {
                //todo good point for logger
                console.log(`Model [${model.name}] Synchronized`)
            })
            .catch(err => {
                throw err;
            })
    }

    getAllEntries<T, R>(model: Sequelize.Model<T, R>): Promise<Array<T>> {
        return new Promise<Array<T>>((resolve: Function, reject: Function) => {
            this.sequelize.transaction((t: Transaction) => {
                return model.findAll()
                    .then((data: Array<T>) => {
                        resolve(data);
                    })
                    .catch((error: Error) => {
                        reject(error);
                    });
            });
        });
    }

    createEntry<T, R>(model: Sequelize.Model<T, R>, instance: R): Promise<T> {
        return new Promise<T>((resolve: Function, reject: Function) => {
            if (instance) {
                this.sequelize.transaction((t: Transaction) => {
                    return model.create(instance)
                        .then((res: T) => {
                            resolve(res);
                        })
                        .catch((error: Error) => {
                            reject(error);
                        });
                });
            } else {
                reject(new Error("Empty Entry"));
            }
        });
    }

    getEntry<T, R>(uuid: string, model: Sequelize.Model<T, R>): Promise<T> {
        return new Promise<T>((resolve: Function, reject: Function) => {
            this.sequelize.transaction((t: Transaction) => {
                return model.findByPrimary(uuid)
                    .then((entry: T | null) => {
                        resolve(entry);
                    })
                    .catch((error: Error) => {
                        reject(error);
                    });
            });
        });
    }

    getEntryBySocial(socialId: number, provider: string, model: Sequelize.Model<UserInstance, UserAttributes>):
        Promise<UserAttributes> {
        return new Promise<UserInstance>((resolve: Function, reject: Function) => {
            this.sequelize.transaction((t: Transaction) => {
                return model.findOne({
                    where: {
                        socialId: socialId,
                        provider: provider
                    }
                })
                    .then((entry: UserAttributes | null) => {
                        resolve(entry);
                    })
                    .catch((error: Error) => {
                        reject(error);
                    });
            });
        });
    }

    deleteEntry<T, R>(uuid: string, model: Sequelize.Model<T, R>): Promise<T> {
        return new Promise<T>((resolve: Function, reject: Function) => {
            this.sequelize.transaction((t: Transaction) => {
                return model.destroy({
                    where: {uuid}
                })
                    .then((wasDeletedCount: number) => {
                        resolve(wasDeletedCount > 0);
                    })
                    .catch((error: Error) => {
                        reject(error);
                    });
            });
        });
    };

    //todo I really mad of that method
    //todo i need to extend my base Entry DataBase with separate method from other parts
    //todo base DataBase have to make only CRUD-direction
    getEntryByUsername(username: string, model: Sequelize.Model<UserInstance, UserAttributes>):
        Promise<UserAttributes> {
        return new Promise<UserInstance>((resolve: Function, reject: Function) => {
            this.sequelize.transaction((t: Transaction) => {
                //todo I don't know how it doesn't suppress
                return model.findOne({
                    where: {
                        username: username
                    }
                })
                    .then((entry: UserAttributes | null) => {
                        resolve(entry);
                    })
                    .catch((error: Error) => {
                        reject(error);
                    });
            });
        });
    };
}