import SequelizeStatic, {DataTypes, Model} from "sequelize";
import {DBConfig} from "../../config/config";
import Sequelize from "sequelize";
import {User, UserAttributes, UserInstance} from "./User";

export class DataBase {

    private _sequelize: Sequelize.Sequelize;
    //private model: Model<UserInstance, UserAttributes>;

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


        const User = this.sequelize.define('Test', {
            username: {
                type: Sequelize.STRING
            },
            password: {
                type: Sequelize.STRING
            }
        });
        User.sync({force: true}).then(() => {
            return User.create({
                username: 'ivan',
                password: '123'
            });
        });
        /*User.findAll().then(users => {
            console.log(users)
        })*/
        User.findById(1).then(res => {
            console.log(res)
        })
    }

   /* addUser(user: User): void {
        this.model.sync({force: true}).then(() => {
            return this.model.create({
                username: user.username,
                password: user.password
            });
        });
    }*/

    /*getuserList(): Array<UserInstance> | void {
        this.model.findAll()
            .then((users: Array<UserInstance>) => {
                return users;
            })
    }*/

    checkConnection(): void {
        const auth: Promise<void> = this.sequelize.authenticate();
        auth
            .then(() => {
                console.log("db success")
            })
            .catch((err) => {
                throw err
            })
    }

    get sequelize(): Sequelize.Sequelize {
        return this._sequelize;
    }

    set sequelize(value: Sequelize.Sequelize) {
        this._sequelize = value;
    }

}