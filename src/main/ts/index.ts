import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import express, {Express, Request, Response} from "express";
import cookieSession from "cookie-session";
import {ServerConfig} from "./config/config";
import {db, router, UserModelInstance} from "./routers"
import passport, {PassportStatic} from "passport";
import {UserInstance} from "./db/models/User";
import {User} from "./form/instances/User";

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
            done(null, user.uuid);
        });
        passport.deserializeUser(async (uuid: string, done: Function) => {
            try {
                const entry = await db.getEntry(uuid, UserModelInstance);
                if (entry) {
                    const data = new User(
                        entry.username,
                        entry.password,
                    );
                    return done(null, data);
                }
                return done(null, false);

            } catch (error) {
                return done(null, false);
            }
        });
        this.app.use(
            cookieSession({
                name: "cookie-session",
                maxAge: 20 * 24 * 60 * 60 * 1000,
                secret: "secret",
                secure: true
            })
        );
        this.app.use(passport.initialize());
        this.app.use(passport.session());
    }

    start(): void {
        this.app.listen(ServerConfig.PORT, ServerConfig.HOST, () => {
            console.log(`listen ${ServerConfig.PORT}`)
        })
    };
}

const server = new Server();
server.start();