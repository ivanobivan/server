import {Strategy} from "passport-local";
import bcrypt from "bcrypt-nodejs";
import {UserInstance} from "../db/models/User";
import {server} from "../index";
import {User} from "../db/instances/User";

export const localLogin = new Strategy(
    async (username: string, password: string, done: Function) => {
        try {
            const model = server.wrapper.getUserModel();
            let entry: UserInstance | null = null;
            if (model) {
                entry = await server.wrapper.db.getEntryByUsername(username, model);
                if (entry) {
                    return done(null, new User(entry.username, entry.password));
                }
            }
            //todo need compare password
            /*if (bcrypt.compareSync(password, entry.password)) {
                return done(null, entry);
            }*/
            return done(null, false, {message: "Incorrect Password"});
        } catch (error) {
            return done(error);
        }
    }
);

// @ts-ignore
export const localSignUp = new Strategy(
    async (username: string, password: string, done: Function): Promise<void> => {
        try {
            //todo here i want to salt that password
            /*if(req.body) {
                const entry = db.getEntry(req.body.uuid, UserModelInstance);
                if (entry) {

                }
            }*/
            /*await UserModelInstance.findOrCreate({
                where: {
                    username: username
                },
                defaults: {
                    username: username,
                    password: password
                    /!* password: bcrypt.hashSync(
                        password,
                        bcrypt.genSaltSync(8)
                    )*!/
                }
            }).spread((values, created) => {
                if (created) {
                    done(null, values);
                } else {
                    done(null, false, {message: "User exist"});
                }
            });*/
        } catch (e) {
            done(e)
        }


    }
);
