import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import http from "http";
import path from "path";
import express, {Express, Request, Response} from "express";
import Sequelize from "sequelize";
import {ServerConfig} from "./config/config";
import {DataBase} from "./db/models";
import {User, UserAttributes, UserInstance} from "./db/models/User";

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
const check =  db.checkConnection();
check
    .then(() => {
        db.model.sync()
            .then(() => {
                db.model.create({
                    username: "ivan",
                    password: "123"
                })
                    .then(()=> {
                        db.model.findAll()
                            .then((users:Array<UserInstance>)=>{
                                // @ts-ignore
                                console.log("SUCCESS " + users.length);
                            })
                            .catch((err:Error)=>{
                                throw Error;
                            })
                    })
                    .catch((err:Error)=>{
                        throw err;
                    })

            .catch((err:Error) => {
                throw err;
            })
    })
    .catch((err:Error) => {
       throw err;
    });

server.route();
server.start();
