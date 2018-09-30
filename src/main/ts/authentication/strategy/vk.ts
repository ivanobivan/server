import {Params, Profile, Strategy, VerifyCallback} from "passport-vkontakte";
import Sequelize from "sequelize";
import {UserAttributes, UserInstance} from "../../db/models/User";
import {DataBase} from "../../db";
import {User} from "../../db/instances/User";


export const vkLogin = (model: Sequelize.Model<UserInstance, UserAttributes>, db: DataBase) => {
    return new Strategy(
        {
            clientID: "",
            clientSecret: "",
            callbackURL: "http://0.0.0.0:3000/auth/vkontakte/callback"
        },
        async (
            accessToken: string,
            refreshToken: string,
            params: Params,
            profile: Profile,
            done: VerifyCallback
        ) => {
            try {
                const user = await db.getEntryBySocial(params.user_id, "vk", model);
                if (!user) {
                    const newUser = new User(profile.username || "", "", "vk", params.user_id, params.email);
                    await db.createEntry(model, newUser);
                    return done(null, newUser);
                }
                return done(null, false);
            } catch (error) {
                console.log("ERROR", error);
                done(error);
            }
        }
    )
};