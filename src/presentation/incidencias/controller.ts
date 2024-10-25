import { Request, Response } from "express";
import { IncidenciaService } from "../services";
import { CustomError, LoginUserDto, RegisterTipoIncidenciaDto, UpdateUserDto } from "../../domain";

export class IncidenciasController {
    constructor(
        public readonly incidenciaService: IncidenciaService,
    ) { }


    private handleError = (error: unknown, res: Response) => {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ error: error.message });
        }
    }


    registerTipoIncidencia = (req: Request, res: Response) => {
        const [error, registerDto] = RegisterTipoIncidenciaDto.create(req.body);
        if (error) return res.status(400).json({ error });

        this.incidenciaService.registerTipoIncidencia(registerDto!)
            .then((tipoIncidencia) => res.json(tipoIncidencia))
            .catch(error => this.handleError(error, res))
    }

    updateTipoIncidencia = (req: Request, res: Response) => {
        const [error, registerDto] = RegisterTipoIncidenciaDto.create(req.body);
        if (error) return res.status(400).json({ error });


        this.incidenciaService.updateTipoIncidencia(registerDto!)
            .then((user) => res.json(user))
            .catch(error => this.handleError(error, res))
    }


    getAllTipoIncidencia = (req: Request, res: Response) => {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const searchQuery = req.query.search as string || '';

        this.incidenciaService.getAllTipoIncidencia(page, limit, searchQuery)
            .then((tipoIncidencia) => res.json(tipoIncidencia))
            .catch(error => this.handleError(error, res))
    }

    deleteTipoIncidenciaById = (req: Request, res: Response) => {
        const id = req.params.id;
        this.incidenciaService.deleteTipoIncidenciaById(id)
            .then((tipoIncidencia) => res.json(tipoIncidencia))
            .catch(error => this.handleError(error, res))
    }

    getTipoIncidenciaById = (req: Request, res: Response) => {
        const id = req.params.id;
        this.incidenciaService.getTipoIncidenciaById(id)
            .then((tipoIncidencia) => res.json(tipoIncidencia))
            .catch(error => this.handleError(error, res))
    }


}