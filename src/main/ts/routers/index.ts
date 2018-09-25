import {Request, Response, Router} from "express";
import {DataBase} from "../db";
import UserModel, {UserInstance} from "../db/models/User";

export const router = Router();

const db = new DataBase();
const User = UserModel(db.sequelize);

router.get("/data", (req: Request, res: Response) => {
    db.getAllEntries(User)
        .then((data: Array<UserInstance>) => {
            return res.status(201).send(data);
        })
        .catch((error: Error) => {
            return res.status(409).send(error);
        });
});

router.post("/create", (req: Request, res: Response) => {
    console.log(req.body);
    db.createEntry(User, req.body)
        .then((data: UserInstance) => {
            return res.status(201).send(data);
        })
        .catch((error: Error) => {
            return res.status(409).send(error);
        });
});
