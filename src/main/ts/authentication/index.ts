import {Strategy as LocalStrategy} from "passport-local";
import {Strategy as VKStrategy} from "passport-vkontakte";
import passport, {PassportStatic} from "passport";
import Sequelize from "sequelize";
import {UserAttributes, UserInstance} from "../db/models/User";
import {DataBase} from "../db";
import {type} from "os";

export abstract class Authentication {
    abstract _logIn: LocalStrategy | VKStrategy;
    abstract _signUp?: LocalStrategy | VKStrategy;
    passport: PassportStatic;
    abstract _strategyLogInName: string;
    abstract _strategySignUpName?: string;

    protected constructor() {
        this.passport = passport;
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
}

export interface SocialData {
    clientID: string;
    clientSecret: string;
    callbackURL: string;
}