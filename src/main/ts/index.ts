import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import express, {Express, Request, Response} from "express";
import {ServerConfig} from "./config/config";
import {router} from "./routers"
import passport, {PassportStatic} from "passport";
import {UserInstance} from "./db/models/User";

class Server {
    private app: Express;

    constructor() {
        this.app = express();
        this.app.use(bodyParser.json());
        this.app.use(cookieParser());
        this.app.use("/api", router);
        this.app.use((error: Error, req: Request, res: Response, next: Function) => {
            if (error) {
                res.status(400).send(error);
            }
        });
        passport.serializeUser((user: UserInstance, done: Function) => {
            done(null, user.id);
        });
        passport.deserializeUser(async (id: number, done: Function) => {

        })
    }

    start(): void {
        this.app.listen(ServerConfig.PORT, ServerConfig.HOST, () => {
            console.log(`listen ${ServerConfig.PORT}`)
        })
    };
}

const server = new Server();
server.start();