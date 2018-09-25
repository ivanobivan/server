import { Request, Response, Router } from "express";

export const router = Router();

router.post("/", (req: Request, res: Response) => {
    programService
        .create(req.body)
        .then((product: ProgramInstance) => {
            return res.status(201).send(product);
        })
        .catch((error: Error) => {
            return res.status(409).send(error);
        });
});