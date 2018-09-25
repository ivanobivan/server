import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import express, {Express, Request, Response} from "express";
import {ServerConfig} from "./config/config";
import {router} from "./routers"

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
    }

    start(): void {
        this.app.listen(ServerConfig.PORT, ServerConfig.HOST, () => {
            console.log(`listen ${ServerConfig.PORT}`)
        })
    };
}

const server = new Server();
server.start();


/*const db = new DataBase();
const check = db.checkConnection();
check
    .then(() => {
        console.log("DB CONNECTION SUCCESS");
        const User = UserModel(db.sequelize);
        User.findAll()
            .then((users: Array<UserInstance>) => {
                console.log("success " + users[0].password)
            })

    })
    .catch((error: Error) => {
        throw error
    });*/
