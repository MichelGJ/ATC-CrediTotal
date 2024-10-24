import { Request, Response } from "express";
import { RegisterUserDto } from "../../domain/dtos/auth/register-user.dto";
import { AuthService } from "../services";
import { CustomError, LoginUserDto, UpdateUserDto } from "../../domain";

export class AuthController {
    constructor(
        public readonly authService: AuthService,
    ) { }


    private handleError = (error: unknown, res: Response) => {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ error: error.message });
        }
    }


    registerUser = (req: Request, res: Response) => {
        const [error, registerDto] = RegisterUserDto.create(req.body);
        if (error) return res.status(400).json({ error });

        this.authService.registerUser(registerDto!)
            .then((user) => res.json(user))
            .catch(error => this.handleError(error, res))
    }

    updateUser = (req: Request, res: Response) => {
        const [error, registerDto] = RegisterUserDto.create(req.body);
        if (error) return res.status(400).json({ error });


        this.authService.updateUser(registerDto!)
            .then((user) => res.json(user))
            .catch(error => this.handleError(error, res))
    }


    loginUser = (req: Request, res: Response) => {
        const [error, loginUserDto] = LoginUserDto.create(req.body);
        if (error) return res.status(400).json({ error });


        this.authService.loginUser(loginUserDto!)
            .then((user) => res.json(user))
            .catch(error => this.handleError(error, res))
    }

    getRoles = (req: Request, res: Response) => {
        this.authService.getRoles()
            .then((user) => res.json(user))
            .catch(error => this.handleError(error, res))
    }

    getUsers = (req: Request, res: Response) => {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const searchQuery = req.query.search as string || '';

        this.authService.getUsers(page, limit, searchQuery)
            .then((user) => res.json(user))
            .catch(error => this.handleError(error, res))
    }

    deleteUserById = (req: Request, res: Response) => {
        const id = req.params.id;
        this.authService.deleteUserById(id)
            .then((user) => res.json(user))
            .catch(error => this.handleError(error, res))
    }

    getUserById = (req: Request, res: Response) => {
        const id = req.params.id;
        this.authService.getUserById(id)
            .then((user) => res.json(user))
            .catch(error => this.handleError(error, res))
    }

    // validateEmail = (req: Request, res: Response) => {
    //     const { token } = req.params;
    //     this.authService.validateEmail(token)
    //         .then(() => res.json('Email validated'))
    //         .catch(error => this.handleError(error, res));
    //     // res.json(token);
    // }

}