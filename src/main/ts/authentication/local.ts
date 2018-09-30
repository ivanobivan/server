import {Strategy} from "passport-local";
import bcrypt from "bcrypt-nodejs";
import {UserAttributes, UserInstance} from "../db/models/User";
import {User} from "../db/instances/User";
import {DataBase} from "../db";
import Sequelize from "sequelize";

export const localLogin = (model: Sequelize.Model<UserAttributes, UserInstance>, db: DataBase) => {
    return new Strategy(
        async (username: string, password: string, done: Function) => {
            try {
                const entry = await db.getEntryByUsername(username, model);
                if (!entry) {
                    return done(null, false, {message: "User Not Found"});
                }
                if (!bcrypt.compareSync(password, entry.password)) {
                    return done(null, false, {message: "Incorrect Password"});
                }
                return done(null, new User(entry.username, entry.password));
                //todo need compare password
                /*if (bcrypt.compareSync(password, entry.password)) {
                    return done(null, entry);
                }*/
            } catch (error) {
                return done(error);
            }
        }
    )
};

export const localSignUp = (model: Sequelize.Model<UserAttributes, UserInstance>, db: DataBase) => {
    return new Strategy(
        async (username: string, password: string, done: Function): Promise<void> => {
            try {
                const entry = await db.getEntryByUsername(username, model);
                if (!entry) {
                    const newUser = new User(username, bcrypt.hashSync(password, bcrypt.genSaltSync(8)));
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
