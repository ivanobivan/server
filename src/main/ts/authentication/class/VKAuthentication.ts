import {Strategy} from "passport-vkontakte";
import {Authentication, SocialData} from "../index";
import {PassportStatic} from "passport";

export class VKAuthentication extends Authentication {

    static PROVIDER:string = "vk";
    _logIn: Strategy;
    _signUp?: Strategy;
    _strategyLogInName: string;
    _strategySignUpName?: string;

    constructor(
        logIn: Strategy,
        strategyLogInName: string
    ) {
        super();
        this._logIn = logIn;
        this._strategyLogInName = strategyLogInName;
        this.passport.use(this.strategyLogInName, this.logIn);
    }

    get logIn(): Strategy {
        return this._logIn;
    }

    set logIn(value: Strategy) {
        this._logIn = value;
    }

    get strategyLogInName(): string {
        return this._strategyLogInName;
    }

    set strategyLogInName(value: string) {
        this._strategyLogInName = value;
    }

    get passport(): PassportStatic {
        return super.passport;
    }

    set passport(value: PassportStatic) {
        super.passport = value;
    }

}