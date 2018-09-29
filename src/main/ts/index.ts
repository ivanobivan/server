import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import express, {Express, Request, Response} from "express";
import cookieSession from "cookie-session";
import {ServerConfig} from "./config/config";
import {RouterWrapper} from "./routers"
import {UserInstance} from "./db/models/User";

//todo logger morgan
export class Server {
    private app: Express;
    static routerWrapper:RouterWrapper;

    constructor() {
        this.app = express();
        this.app.use(bodyParser.json());
        this.app.use(cookieParser());
        this.app.use((error: Error, req: Request, res: Response, next: Function) => {
            if (error) {
                res.status(400).send(error);
            }
        });
        const routerWrapper = new RouterWrapper();
        Server.routerWrapper = routerWrapper;
        routerWrapper.syncAllDBEntries();

        const localAuth = routerWrapper.localAuthentication;

        localAuth.passport.use(
            localAuth.strategyLogInName,
            localAuth.logIn
        );
        localAuth.passport.use(
            localAuth.strategySignUpName,
            localAuth.signUp
        );
        this.app.use(
            cookieSession({
                name: "cookie-session",
                maxAge: 20 * 24 * 60 * 60 * 1000,
                secret: "secret",
                secure: true
            })
        );
        this.app.use(localAuth.passport.initialize());
        this.app.use(localAuth.passport.session());
        routerWrapper.hangApiRoutes();
        routerWrapper.hangAuthRoutes();
        this.app.use("/api", routerWrapper.apiRouter);
        this.app.use("/auth", routerWrapper.authRouter);
    }

    start(): void {
        this.app.listen(ServerConfig.PORT, ServerConfig.HOST, () => {
            console.log(`listen ${ServerConfig.PORT}`)
        })
    };
}

const server = new Server();
server.start();