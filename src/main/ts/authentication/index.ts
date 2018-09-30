import {Strategy} from "passport-local";
import passport, {PassportStatic} from "passport";
import {UserAttributes, UserInstance} from "../db/models/User";
import Sequelize from "sequelize";
import {DataBase} from "../db";

abstract class Authentication {
    abstract _logIn: Strategy;
    abstract _signUp: Strategy;
    passport: PassportStatic;
    abstract _strategyLogInName: string;
    abstract _strategySignUpName: string;

    protected constructor() {
        this.passport = passport;
    }
}

export class LocalAuthentication extends Authentication {

    _logIn: Strategy;
    _signUp: Strategy;
    _strategyLogInName: string;
    _strategySignUpName: string;


    constructor(logIn: Strategy, signUp: Strategy, strategyLogInName: string, strategySignUpName: string,) {
        super();
        this._logIn = logIn;
        this._signUp = signUp;
        this._strategyLogInName = strategyLogInName;
        this._strategySignUpName = strategySignUpName;
        this.passport.use(this.strategyLogInName, this.logIn);
        this.passport.use(this.strategySignUpName, this.signUp);
    }

    public setUserCookie(model: Sequelize.Model<UserInstance, UserAttributes>, db: DataBase): void {
        this.passport.serializeUser(
            (user: UserInstance, done: Function) => {
                done(null, user.username)
            }
        );
        this.passport.deserializeUser(
            async (username: string, done: Function) => {
                try {
                    const entry = await db.getEntryByUsername(username, model);
                    if (entry) {
                        return done(null, entry);
                    }
                } catch (error) {
                    return done(null, false);
                }
            }
        );
    }

    get logIn(): Strategy {
        return this._logIn;
    }

    set logIn(value: Strategy) {
        this._logIn = value;
    }

    get signUp(): Strategy {
        return this._signUp;
    }

    set signUp(value: Strategy) {
        this._signUp = value;
    }


    get passport(): passport.PassportStatic {
        return super.passport;
    }

    set passport(value: passport.PassportStatic) {
        super.passport = value;
    }

    get strategyLogInName(): string {
        return this._strategyLogInName;
    }

    set strategyLogInName(value: string) {
        this._strategyLogInName = value;
    }

    get strategySignUpName(): string {
        return this._strategySignUpName;
    }

    set strategySignUpName(value: string) {
        this._strategySignUpName = value;
    }

}