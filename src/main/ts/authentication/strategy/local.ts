import {Strategy} from "passport-local";
import * as bCrypt from "bcrypt-nodejs";
import {UserAttributes, UserInstance} from "../../db/models/User";
import {User} from "../../db/instances/User";
import {DataBase} from "../../db";
import Sequelize from "sequelize";

export const localLogIn = (model: Sequelize.Model<UserInstance, UserAttributes>, db: DataBase) => {
    return new Strategy(
        async (username: string, password: string, done: Function) => {
            try {
                const entry = await db.getEntryByUsername(username, model);
                if (!entry) {
                    return done(null, false, {message: "User Not Found"});
                }
                if (!bCrypt.compareSync(password, entry.password)) {
                    return done(null, false, {message: "Incorrect Password"});
                }
                return done(null, new User(entry.username, entry.password));
            } catch (error) {
                return done(error);
            }
        }
    )
};

export const localSignUp = (model: Sequelize.Model<UserInstance, UserAttributes>, db: DataBase) => {
    return new Strategy(
        async (username: string, password: string, done: Function): Promise<void> => {
            try {
                const entry = await db.getEntryByUsername(username, model);
                if (!entry) {
                    const newUser = new User(username, bCrypt.hashSync(password, bCrypt.genSaltSync(8)));
                    await db.createEntry(model, newUser);
                    return done(null, newUser);
                }
                return done(null, false, {message: "User Exist"});
            } catch (e) {
                return done(e)
            }
        }
    )
};
