import { NextFunction, Request, Response } from 'express';



export class ValidateMiddleware {


    static async validate(req: Request, res: Response, next: NextFunction) {

        try {

            const cedula = req.body.userId;

            // Regular expression for a cedula format (adjust based on your requirements)
            const cedulaRegex = /^[0-9]{8}$/;

            if (!cedulaRegex.test(cedula)) {
                return res.status(400).json({ error: 'Debe contener 8 digitos numéricos' });
            }

            // If cedula is valid, proceed to the next middleware or route handler
            next();

        } catch (error) {

            console.log(error);
            res.status(500).json({ error: 'Internal server error' });

        }

    }
}

