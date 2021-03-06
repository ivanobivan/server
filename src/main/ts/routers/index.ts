import {NextFunction, Request, Response, Router} from "express";
import {DataBase} from "../db";
import UserModel, {UserInstance} from "../db/models/User";

import Sequelize from "sequelize";
import {User} from "../db/instances/User";
import {localLogIn, localSignUp} from "../authentication/strategy/local";
import {vkLogin} from "../authentication/strategy/vk";
import {LocalAuthentication} from "../authentication/class/LocalAuthentication";
import {VKAuthentication} from "../authentication/class/VKAuthentication";
import {VKSocialData} from "../authentication/social/VKSocialData";
import {Authentication} from "../authentication";
import {VKPrivateConfig} from "../config/private";


export class AppWrapper {
    private _db: DataBase;
    private _DBEntries: Map<string, Sequelize.Model<any, any>>;
    private _AuthenticationMap: Map<string, Authentication>;
    private _apiRouter: Router;
    private _authRouter: Router;
    private _innerRouter: Router;
    private _auth: Authentication;

    constructor() {
        this._DBEntries = new Map();
        this._AuthenticationMap = new Map();
        this._db = new DataBase();
        const userEntry = UserModel(this._db.sequelize);
        this._DBEntries.set(User.ENTRY_NAME, userEntry);
        this.syncAllDBEntries();

        const localAuthentication = new LocalAuthentication(
            localLogIn(userEntry, this.db),
            localSignUp(userEntry, this.db),
            "localAuthentication-logIn",
            "localAuthentication-signUp",
        );

        const vkSocialData = new VKSocialData(
            VKPrivateConfig.CLIENT_ID,
            VKPrivateConfig.CLIENT_SECRET,
            VKPrivateConfig.CALLBACK_URL,
        );

        const vkAuthentication = new VKAuthentication(
            vkLogin(userEntry, this.db, vkSocialData, VKAuthentication.PROVIDER),
            "vkAuthentication-logIn",
        );
        this._AuthenticationMap.set(
            LocalAuthentication.PROVIDER,
            localAuthentication
        );
        this._AuthenticationMap.set(
            VKAuthentication.PROVIDER,
            vkAuthentication
        );
        this._auth = <Authentication>localAuthentication;
        this._auth.setUserCookie(userEntry, this.db);
        this._apiRouter = Router();
        this._authRouter = Router();
        this._innerRouter = Router();
        this.hangApiRoutes();
        this.hangAuthRoutes();
        this.hangInnerRoutes();
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


    get AuthenticationMap(): Map<string, Authentication> {
        return this._AuthenticationMap;
    }

    set AuthenticationMap(value: Map<string, Authentication>) {
        this._AuthenticationMap = value;
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


    get innerRouter(): Router {
        return this._innerRouter;
    }

    set innerRouter(value: Router) {
        this._innerRouter = value;
    }

    get auth(): Authentication {
        return this._auth;
    }

    set auth(value: Authentication) {
        this._auth = value;
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

    public getAuthenticationModel(key: string): Authentication | undefined {
        return this.AuthenticationMap.get(key);
    }

    public hangInnerRoutes(): void {
        this.innerRouter.post("/checkCaptcha", (req: Request, res: Response) => {
            if (req.body.captcha === "123") {
                if (req.body.type === "certificate") {
                    res.sendStatus(400);
                } else if (req.body.type === "other") {
                    res.sendStatus(400);
                } else if (req.body.type === "myself") {
                    return res.status(200).json(req.body);
                }
                res.sendStatus(400);
            }
            return  res.sendStatus(400);
        });

        this.innerRouter.post("/refreshCaptcha", (req: Request, res: Response) => {
            return res.status(200).json({message: "YAP"})
        });
    }

    public hangApiRoutes(): void {


        //todo /home /fail subsidiary routes without redirect, only json
        this.apiRouter.get("/home", (req: Request, res: Response) => {
            return res.status(200).json({message: "YAP"})
        });

        this.apiRouter.get("/fail", (req: Request, res: Response) => {
            return res.status(200).json({message: "NOPE"})
        });

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


    hangAuthRoutes(): void {
        this.authRouter.post('/signUp', async (req: Request, res: Response) => {
            try {
                const localAuthentication = <LocalAuthentication>this.getAuthenticationModel(LocalAuthentication.PROVIDER);
                if (req.isUnauthenticated() && localAuthentication) {
                    return await localAuthentication.passport.authenticate(
                        localAuthentication.strategySignUpName,
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
                const localAuthentication = <LocalAuthentication>this.getAuthenticationModel(LocalAuthentication.PROVIDER);
                if (req.isUnauthenticated() && localAuthentication) {
                    return await localAuthentication.passport.authenticate(
                        localAuthentication.strategyLogInName,
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

        this.authRouter.get("/vkontakte", async (req: Request, res: Response, next: NextFunction) => {
            try {
                const vkAuthentication = <VKAuthentication>this.getAuthenticationModel(VKAuthentication.PROVIDER);
                if (req.isUnauthenticated() && vkAuthentication) {
                    return await vkAuthentication.passport.authenticate(
                        vkAuthentication.strategyLogInName
                    )(req, res, next);
                }
                return res.sendStatus(409);
            } catch (e) {
                return res.status(500).send(e);
            }
        });

        this.authRouter.get("/vkontakte/callback", async (req: Request, res: Response, next: NextFunction) => {
            try {
                const vkAuthentication = <VKAuthentication>this.getAuthenticationModel(VKAuthentication.PROVIDER);
                if (req.isUnauthenticated() && vkAuthentication) {
                    return await vkAuthentication.passport.authenticate(
                        vkAuthentication.strategyLogInName,
                        {
                            successRedirect: '/api/home',
                            failureRedirect: '/api/fail'
                        }
                    )(req, res, next);
                }
                return res.sendStatus(409);
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

