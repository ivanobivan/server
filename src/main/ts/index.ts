import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import express, {Express, Request, Response} from "express";
import cookieSession from "cookie-session";
import {ServerConfig} from "./config/config";
import {AppWrapper} from "./routers";
import fs from "fs";
import path from "path";
import https from "https";
import {Certificate} from "./certificate";

//todo logger morgan
//todo realize problem with Sequalize.{anyone}, rename
class Server {
    private app: Express;
    private certificate: Certificate;

    constructor() {
        this.certificate = new Certificate(
            fs.readFileSync(path.resolve('src/main/ts/certificate/files/server.key')),
            fs.readFileSync(path.resolve('src/main/ts/certificate/files/server.crt'))
        );
        this.app = express();
        this.app.use(bodyParser.urlencoded({extended: false}));
        this.app.use(cookieParser());
        this.app.use(bodyParser.json());
        this.app.use((error: Error, req: Request, res: Response, next: Function) => {
            if (error) {
                res.status(400).send(error);
            }
        });
        this.app.use(
            cookieSession({
                //todo why I can't send custom cookie-name
                //name: "cookie-session",
                maxAge: 20 * 24 * 60 * 60 * 1000,
                secret: "secret",
                //secure:  - https only
            })
        );
        const wrapper = new AppWrapper();
        this.app.use(wrapper.auth.passport.initialize());
        this.app.use(wrapper.auth.passport.session());
        this.app.enable("view cache");
        this.app.set('view engine', 'ejs');
        this.app.use("/api", wrapper.apiRouter);
        this.app.use("/auth", wrapper.authRouter);
    }


    start(): void {
        https.createServer(this.certificate, this.app).listen(
            ServerConfig.PORT,
            ServerConfig.HOST,
            () => {
            console.log("server started")
        });
    };
}

const server = new Server();
server.start();