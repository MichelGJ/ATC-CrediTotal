import { Request, Response } from "express";
import { AtpService } from "../services";
import { CustomError, RegisterTicketPresencialDto, UpdateTicketPresencialDto} from "../../domain";

export class AtpController {
    constructor(
        public readonly atpService: AtpService,
    ) { }


    private handleError = (error: unknown, res: Response) => {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ error: error.message });
        }
    }

    registerTicketPresencial = (req: Request, res: Response) => {
        const [error, registerDto] = RegisterTicketPresencialDto.create(req.body);
        if (error) return res.status(400).json({ error });

        this.atpService.registerTicketPresencial(registerDto!)
            .then((ticketPresencial) => res.json(ticketPresencial))
            .catch(error => this.handleError(error, res))
    }

    updateTicketPresencial = (req: Request, res: Response) => {
        const [error, updateDto] = UpdateTicketPresencialDto.create(req.body);
        if (error) return res.status(400).json({ error });


        this.atpService.updateTicketPresencial(updateDto!)
            .then((ticketPresencial) => res.json(ticketPresencial))
            .catch(error => this.handleError(error, res))
    }


    getAllTicketPresencial = (req: Request, res: Response) => {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const searchQuery = req.query.search as string || '';

        this.atpService.getAllTicketPresencial(page, limit, searchQuery)
            .then((ticketPresencial) => res.json(ticketPresencial))
            .catch(error => this.handleError(error, res))
    }

    deleteTicketPresencialById = (req: Request, res: Response) => {
        const id = req.params.id;
        this.atpService.deleteTicketPresencialById(id)
            .then((ticketPresencial) => res.json(ticketPresencial))
            .catch(error => this.handleError(error, res))
    }

    getTicketPresencialById = (req: Request, res: Response) => {
        const id = req.params.id;
        this.atpService.getTicketPresencialById(id)
            .then((ticketPresencial) => res.json(ticketPresencial))
            .catch(error => this.handleError(error, res))
    }

}
