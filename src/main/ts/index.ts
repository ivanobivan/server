import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import http from "http";
import path from "path";
import express, {Express, Request, Response} from "express";
import Sequelize from "sequelize";
import {ServerConfig} from "./config/config";
import {DataBase} from "./db/models";
import {User} from "./db/models/User";

class Server {
    private app: Express;

    constructor() {
        this.app = express();
        this.app.use(bodyParser.json());
        this.app.use(cookieParser());
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

    route(): void {
        this.app.get("/", (req: Request, res: Response) => {
            res.send("Test")
        })
    }

}

const server = new Server();
const db = new DataBase();
db.checkConnection();
//db.addUser(new User("ivan","123"));
//db.addUser(new User("ivan2","12345"));

//console.log(db.getuserList());

server.route();
server.start();