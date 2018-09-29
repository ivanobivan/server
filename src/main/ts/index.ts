import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import express, {Express, Request, Response} from "express";
import cookieSession from "cookie-session";
import {ServerConfig} from "./config/config";
import {RouterWrapper} from "./routers"

//todo logger morgan
export class Server {
    private app: Express;
    static routerWrapper: RouterWrapper;

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
        this.app.use(
            cookieSession({
                name: "cookie-session",
                maxAge: 20 * 24 * 60 * 60 * 1000,
                secret: "secret",
                secure: true
            })
        );
        this.app.use(routerWrapper.localAuthentication.passport.initialize());
        this.app.use(routerWrapper.localAuthentication.passport.session());
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