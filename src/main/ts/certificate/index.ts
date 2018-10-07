import * as tls from "tls";

export class Certificate implements tls.SecureContextOptions {

    key: Buffer;
    cert: Buffer;
    requestCert?: boolean;
    rejectUnauthorized?: boolean;

    constructor(
        key: Buffer,
        cert: Buffer,
        requestCert?: boolean,
        rejectUnauthorized?: boolean
    ) {
        this.key = key;
        this.cert = cert;
        this.requestCert = requestCert;
        this.rejectUnauthorized = rejectUnauthorized;
    }
}