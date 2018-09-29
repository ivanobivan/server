import {Request, Response, Router} from "express";
import {DataBase} from "../db";
import UserModel, {UserAttributes, UserInstance} from "../db/models/User";
import {LocalAuthentication} from "../authentication";
import Sequelize from "sequelize";
import {User} from "../db/instances/User";
import {Res} from "awesome-typescript-loader/dist/checker/protocol";


export class RouterWrapper {
    private _db: DataBase;
    private _DBEntries: Map<string, Sequelize.Model<any, any>> = new Map();
    private _localAuthentication: LocalAuthentication;
    private _apiRouter: Router;
    private _authRouter: Router;

    constructor() {
        this._db = new DataBase();
        const userEntry = UserModel(this._db.sequelize);
        this._DBEntries.set(User.ENTRY_NAME, userEntry);
        this._localAuthentication = new LocalAuthentication(
            "localAuthentication-logIn",
            "localAuthentication-signUp"
        );
        this.localAuthentication.passport.serializeUser((user: UserInstance, done: Function) => {
            done(null, user.uuid);
        });
        this.localAuthentication.passport.deserializeUser(async (uuid: string, done: Function) => {
            try {
                const model = this.getUserModel();
                if (model) {
                    const entry = await this.db.getEntry(uuid, model);
                    if (entry) {
                        return done(null, entry);
                    }
                }
                return done(null, false);

            } catch (error) {
                return done(null, false);
            }
        });
        this._apiRouter = Router();
        this._authRouter = Router();
        this.hangApiRoutes();
        this.hangAuthRoutes();
        this.localAuthentication.passport.use(
            this.localAuthentication.strategyLogInName,
            this.localAuthentication.logIn
        );
        this.localAuthentication.passport.use(
            this.localAuthentication.strategySignUpName,
            this.localAuthentication.signUp
        );
    }

    get db(): DataBase {
        return this._db;
    }

    set db(value: DataBase) {
        this._db = value;
    }

    get DBEntries(): Map<string, Sequelize.Model<any, any>> {
        return this._DBEntries;
    }

    set DBEntries(value: Map<string, Sequelize.Model<any, any>>) {
        this._DBEntries = value;
    }

    get localAuthentication(): LocalAuthentication {
        return this._localAuthentication;
    }

    set localAuthentication(value: LocalAuthentication) {
        this._localAuthentication = value;
    }

    get apiRouter(): Router {
        return this._apiRouter;
    }

    set apiRouter(value: Router) {
        this._apiRouter = value;
    }


    get authRouter(): Router {
        return this._authRouter;
    }

    set authRouter(value: Router) {
        this._authRouter = value;
    }

    public syncAllDBEntries(): void {
        this.DBEntries.forEach((value, key) => {
            this.db.syncModel(value);
        });
        this.db.checkConnection();
    }

    //todo this some thoughts about extensible and about routes too
    public getEntryModel(name: string): Sequelize.Model<any, any> | undefined {
        return this.DBEntries.get(name);

    }

    public getUserModel(): Sequelize.Model<UserInstance, UserAttributes> | undefined {
        return this.DBEntries.get(User.ENTRY_NAME);

    }

    public hangApiRoutes(): void {

        this.apiRouter.get("/getAll", async (req: Request, res: Response) => {
            try {
                const model = this.getEntryModel(User.ENTRY_NAME);
                if (model) {
                    const data: Array<UserInstance> = await this.db.getAllEntries(model);
                    return res.status(201).send(data);
                }
                return res.status(400);
            } catch (e) {
                return res.status(400).send(e);
            }
        });

        this.apiRouter.post("/create", async (req: Request, res: Response) => {
            try {
                const model = this.getEntryModel(User.ENTRY_NAME);
                if (model) {
                    const data: UserInstance = await this.db.createEntry(model, req.body);
                    return res.status(201).send(data);
                }
                return res.status(400);
            } catch (e) {
                return res.status(400).send(e);
            }
        });

        this.apiRouter.post("/get", async (req: Request, res: Response) => {
            //todo need think about replace body.uuid
            try {
                const model = this.getEntryModel(User.ENTRY_NAME);
                if (model) {
                    const data: UserInstance = await this.db.getEntry(req.body.uuid, model);
                    return res.status(201).send(data);
                }
                return res.status(400);
            } catch (e) {
                return res.status(400).send(e);
            }
        });
    };


    //todo sign up not working now
    hangAuthRoutes(): void {
        this.authRouter.post('/signUp', (req: Request, res: Response) => {
            try {
                const user = this.localAuthentication.authenticate(
                    this.localAuthentication.strategySignUpName);
                if (user) {
                    return res.status(200).send(user);
                }
                return res.status(400);
            } catch (e) {
                return res.sendStatus(400).send(e);
            }
        });

        this.authRouter.post('/logIn', (req: Request, res: Response): void | Response => {
            try {
                console.log(req.body);
                this.localAuthentication.passport.authenticate(
                    this.localAuthentication.strategyLogInName,
                    (e: Error, user: any) => {
                        if (e) {
                            return res.status(400).send(e)
                        }
                        return res.status(201).send(user);
                    }
                )(req, res);
            } catch (e) {
                return res.status(400).send(e);
            }


        });
    };
}

