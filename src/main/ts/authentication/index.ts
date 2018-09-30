import {Strategy as LocalStrategy} from "passport-local";
import {Strategy as VKStrategy} from "passport-vkontakte";
import passport, {PassportStatic} from "passport";

export abstract class Authentication {
    abstract _logIn: LocalStrategy | VKStrategy;
    abstract _signUp?: LocalStrategy | VKStrategy;
    passport: PassportStatic;
    abstract _strategyLogInName: string;
    abstract _strategySignUpName?: string;

    protected constructor() {
        this.passport = passport;
    }
}

