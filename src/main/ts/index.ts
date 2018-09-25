import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import express, {Express, Request, Response} from "express";
import {ServerConfig} from "./config/config";
import {DataBase} from "./db";
import UserModel, {User, UserAttributes} from "./db/models/User"
import Sequelize, {DataTypes} from "sequelize";


class Server {
    private app: Express;

    constructor() {
        this.app = express();
        this.app.use(bodyParser.json());
        this.app.use(cookieParser());
        //this.app.use("/api/data",);
        this.app.use((error: Error, req: Request, res: Response, next: Function) => {
            if (error) {
                res.status(400).send(error);
            }
        });
    }

    start(): void {
        this.app.listen(ServerConfig.PORT, () => {
            console.log(`listen ${ServerConfig.PORT}`)
        })
    };
}

const server = new Server();
const db = new DataBase();
const check = db.checkConnection();
check
    .then(() => {
        console.log("DB CONNECTION SUCCESS");
        const User = UserModel(db.sequelize);
        User.findAll()
            .then((users: Array<UserAttributes>) => {
                console.log("success " + users[0].password)
            })

    })
    .catch((error: Error) => {
        throw error
    });

server.start();
