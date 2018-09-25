interface ConfigInterface {

}

export class ServerConfig implements ConfigInterface {
    static PORT: number = 3000;

}

export class DBConfig implements ConfigInterface {
    static PORT: number = 5432;
    static USERNAME: string = "postgres";
    static PASSWORD: string = "postgres";
    static HOST: string = "0.0.0.0";
    static DB_NAME: string = "test";
    static DIALECT: string = "postgres";
}