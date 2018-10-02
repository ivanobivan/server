import {SocialData} from "../index";

export class VKSocialData implements SocialData {
    private _callbackURL: string;
    private _clientID: string;
    private _clientSecret: string;


    constructor(
        clientID: string,
        clientSecret: string,
        callbackURL: string,
    ) {
        this._callbackURL = callbackURL;
        this._clientID = clientID;
        this._clientSecret = clientSecret;
    }


    get callbackURL(): string {
        return this._callbackURL;
    }

    set callbackURL(value: string) {
        this._callbackURL = value;
    }

    get clientID(): string {
        return this._clientID;
    }

    set clientID(value: string) {
        this._clientID = value;
    }

    get clientSecret(): string {
        return this._clientSecret;
    }

    set clientSecret(value: string) {
        this._clientSecret = value;
    }

}