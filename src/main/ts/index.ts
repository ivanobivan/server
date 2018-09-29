import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import express, {Express, Request, Response} from "express";
import cookieSession from "cookie-session";
import {ServerConfig} from "./config/config";
import {AppWrapper} from "./routers"

//todo logger morgan
export class Server {
    private app: Express;
    //todo i need thinking about that hook
    static WRAPPER: AppWrapper;

    constructor() {
        this.app = express();
        this.app.use(bodyParser.json());
        this.app.use(cookieParser());
        this.app.use((error: Error, req: Request, res: Response, next: Function) => {
            if (error) {
                res.status(400).send(error);
            }
        });
        this.app.use(
            cookieSession({
                maxAge: 20 * 24 * 60 * 60 * 1000,
                secret: "secret",
                keys: ["ededed"],
                secure: true
            })
        );
        Server.WRAPPER = new AppWrapper();
        this.app.use(Server.WRAPPER.localAuthentication.passport.initialize());
        this.app.use(Server.WRAPPER.localAuthentication.passport.session());
        this.app.use("/api", Server.WRAPPER.apiRouter);
        this.app.use("/auth", Server.WRAPPER.authRouter);
    }

    start(): void {
        this.app.listen(ServerConfig.PORT, ServerConfig.HOST, () => {
            console.log(`listen ${ServerConfig.PORT}`)
        })
    };
}

const server = new Server();
server.start();