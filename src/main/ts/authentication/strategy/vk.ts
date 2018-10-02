import {Params, Profile, Strategy} from "passport-vkontakte";
import Sequelize from "sequelize";
import {UserAttributes, UserInstance} from "../../db/models/User";
import {DataBase} from "../../db";
import {User} from "../../db/instances/User";
import {VKSocialData} from "../social/VKSocialData";


export const vkLogin = (
    model: Sequelize.Model<UserInstance, UserAttributes>,
    db: DataBase,
    socialData: VKSocialData,
    provider: string
) => {
    return new Strategy(
        {
            clientID: socialData.clientID,
            clientSecret: socialData.clientSecret,
            callbackURL: socialData.callbackURL
        },
        async (
            accessToken: string,
            refreshToken: string,
            params: Params,
            profile: Profile,
            done: Function
        ) => {
            try {
                const user = await db.getEntryBySocial(params.user_id, provider, model);
                if (!user) {
                    //todo what if user doesn't have username
                    const newUser = new User(
                        profile.username || "",
                        "",
                        provider,
                        params.user_id,
                        params.email
                    );
                    await db.createEntry(model, newUser);
                    return done(null, newUser);
                }
                return done(null, user);
            } catch (error) {
                //todo place for morgan
                done(error);
            }
        }
    )
};