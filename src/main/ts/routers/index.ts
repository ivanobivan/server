import {Request, Response, Router} from "express";
import {DataBase} from "../db";
import UserModel, {UserAttributes, UserInstance} from "../db/models/User";
import {LocalAuthentication} from "../authentication";
import Sequelize from "sequelize";
import {User} from "../db/instances/User";
import {localLogin, localSignUp} from "../authentication/local";
import passport from "passport";


export class AppWrapper {
    private _db: DataBase;
    private _DBEntries: Map<string, Sequelize.Model<any, any>> = new Map();
    private _localAuthentication: LocalAuthentication;
    private _apiRouter: Router;
    private _authRouter: Router;

    constructor() {
        this._db = new DataBase();
        const userEntry = UserModel(this._db.sequelize);
        this._DBEntries.set(User.ENTRY_NAME, userEntry);
        this.syncAllDBEntries();
        this._localAuthentication = new LocalAuthentication(
            localLogin(userEntry, this.db),
            localSignUp(userEntry, this.db),
            "localAuthentication-logIn",
            "localAuthentication-signUp"
        );
        this.localAuthentication.setUserCookie(userEntry, this.db);
        this._apiRouter = Router();
        this._authRouter = Router();
        this.hangApiRoutes();
        this.hangAuthRoutes();
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

    //todo this some thoughts about extensible
    public getEntryModel(name: string): Sequelize.Model<any, any> | undefined {
        return this.DBEntries.get(name);

    }

    //todo I really don't want to see that anymore
    public getUserModel(): Sequelize.Model<UserInstance, UserAttributes> | undefined {
        return this.DBEntries.get(User.ENTRY_NAME);

    }

    public hangApiRoutes(): void {

        this.apiRouter.get("/getAll", async (req: Request, res: Response) => {
            try {
                const model = this.getEntryModel(User.ENTRY_NAME);
                if (model) {
                    const data: Array<UserInstance> = await this.db.getAllEntries(model);
                    return res.status(200).send(data);
                }
                return res.status(400);
            } catch (e) {
                return res.status(500).send(e);
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
                return res.status(500).send(e);
            }
        });

        this.apiRouter.post("/get", async (req: Request, res: Response) => {
            //todo need think about replace body.uuid
            try {
                const model = this.getEntryModel(User.ENTRY_NAME);
                if (model) {
                    const data: UserInstance = await this.db.getEntry(req.body.uuid, model);
                    return res.status(200).send(data);
                }
                return res.status(400);
            } catch (e) {
                return res.status(500).send(e);
            }
        });

        this.apiRouter.post("/delete", async (req: Request, res: Response) => {
            //todo need think about replace body.uuid
            try {
                const model = this.getEntryModel(User.ENTRY_NAME);
                if (model) {
                    //todo not extensible uuid again
                    const result: number = await this.db.deleteEntry(req.body.uuid, model);
                    return res.status(201).send(result);
                }
                return res.status(400);
            } catch (e) {
                return res.status(500).send(e);
            }
        });
    };


    //todo sign up not working now
    hangAuthRoutes(): void {
        this.authRouter.post('/signUp', async (req: Request, res: Response) => {
            try {
                if (req.isUnauthenticated()) {
                    return await this.localAuthentication.passport.authenticate(
                        this.localAuthentication.strategySignUpName,
                        (e: Error, user: User) => {
                            if (e) {
                                throw e;
                            }
                            req.logIn(user, (err) => {
                                if (err) {
                                    return res.status(422).send(err);
                                }
                                return res.sendStatus(200);
                            });
                        }
                    )(req, res);
                }

                return await res.status(400);
            } catch (e) {
                return res.sendStatus(400).send(e);
            }
        });

        this.authRouter.post('/logIn', async (req: Request, res: Response) => {
            try {
                if (req.isUnauthenticated()) {
                    return await this.localAuthentication.passport.authenticate(
                        this.localAuthentication.strategyLogInName,
                        (e: Error, user: User) => {
                            if (e) {
                                throw e;
                            }
                            req.logIn(user, (err) => {
                                if (err) {
                                    return res.status(422).send(err);
                                }
                                return res.sendStatus(200);
                            });
                        }
                    )(req, res);
                }
                return await res.sendStatus(401);
            } catch (e) {
                return res.status(500).send(e);
            }


        });

        this.authRouter.get("/logOut", (req: Request, res: Response) => {
            if (req.isAuthenticated()) {
                req.logOut();
                return res.sendStatus(200);
            }
            return res.sendStatus(401);
        })
    };
}

