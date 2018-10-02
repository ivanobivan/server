import {Strategy} from "passport-local";
import {PassportStatic} from "passport";
import {Authentication, SocialData} from "../index";

export class LocalAuthentication extends Authentication {

    static PROVIDER:string = "local";
    _logIn: Strategy;
    _signUp: Strategy;
    _strategyLogInName: string;
    _strategySignUpName: string;
    _socialData?: SocialData;



    constructor(logIn: Strategy, signUp: Strategy, strategyLogInName: string,
                strategySignUpName: string) {
        super();
        this._logIn = logIn;
        this._signUp = signUp;
        this._strategyLogInName = strategyLogInName;
        this._strategySignUpName = strategySignUpName;
        this.passport.use(this.strategyLogInName, this.logIn);
        this.passport.use(this.strategySignUpName, this.signUp);
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


    get passport(): PassportStatic {
        return super.passport;
    }

    set passport(value: PassportStatic) {
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