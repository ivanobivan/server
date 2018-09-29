import {localLogin, localSignUp} from "./local"
import {Strategy} from "passport-local";
import passport, {PassportStatic} from "passport";
import {User} from "../db/instances/User";

export interface Authentication {
    logIn: Strategy;
    signUp: Strategy;
    passport: PassportStatic;
    strategyLogInName: string;
    strategySignUpName: string;

    authenticate(strategy: string): User | any;
}

export class LocalAuthentication implements Authentication {

    private _logIn: Strategy;
    private _signUp: Strategy;
    private _passport: PassportStatic;
    private _strategyLogInName: string;
    private _strategySignUpName: string;


    constructor(strategyLogInName: string, strategySignUpName: string) {
        this._logIn = localLogin;
        this._signUp = localSignUp;
        this._passport = passport;
        this._strategyLogInName = strategyLogInName;
        this._strategySignUpName = strategySignUpName;
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
        return this._passport;
    }

    set passport(value: passport.PassportStatic) {
        this._passport = value;
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

    authenticate(strategy: string): User | any {
        this.passport.authenticate(strategy,
            (e: Error, user: User) => {
                if (e) {
                    throw e;
                }
                return user;
            }
        )
    }
}