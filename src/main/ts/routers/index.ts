import {Request, Response, Router} from "express";
import {DataBase} from "../db";
import UserModel, {UserInstance} from "../db/models/User";

export const router = Router();

export const db = new DataBase();
export const UserModelInstance = UserModel(db.sequelize);
db.syncModel(UserModelInstance);

router.get("/getAll", (req: Request, res: Response) => {
    db.getAllEntries(UserModelInstance)
        .then((data: Array<UserInstance>) => {
            return res.status(201).send(data);
        })
        .catch((error: Error) => {
            return res.sendStatus(400).send(error);
        });
});

router.post("/create", (req: Request, res: Response) => {
    db.createEntry(UserModelInstance, req.body)
        .then((data: UserInstance) => {
            return res.status(201).send(data);
        })
        .catch((error: Error) => {
            return res.sendStatus(400).send(error);
        });
});

router.post("/get", (req: Request, res: Response) => {
    //todo need think about replace body.uuid
    db.getEntry(req.body.uuid, UserModelInstance)
        .then((data: UserInstance) => {
            return res.status(201).send(data);
        })
        .catch((error: Error) => {
            //todo incorrect error code 409 (Server Conflict)
            return res.sendStatus(400).send(error);
        });
});