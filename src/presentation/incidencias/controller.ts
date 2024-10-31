import { Request, Response } from "express";
import { IncidenciaService } from "../services";
import { CustomError, RegisterSubTipoIncidenciaDto, RegisterTicketSoporteDto, RegisterTipoIncidenciaDto } from "../../domain";

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
            .then((tipoIncidencia) => res.json(tipoIncidencia))
            .catch(error => this.handleError(error, res))
    }


    getAllTipoIncidencia = (req: Request, res: Response) => {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 0;
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

    registerSubTipoIncidencia = (req: Request, res: Response) => {
        const [error, registerDto] = RegisterSubTipoIncidenciaDto.create(req.body);
        if (error) return res.status(400).json({ error });

        this.incidenciaService.registerSubTipoIncidencia(registerDto!)
            .then((tipoIncidencia) => res.json(tipoIncidencia))
            .catch(error => this.handleError(error, res))
    }

    updateSubTipoIncidencia = (req: Request, res: Response) => {
        const [error, registerDto] = RegisterSubTipoIncidenciaDto.create(req.body);
        if (error) return res.status(400).json({ error });


        this.incidenciaService.updateSubTipoIncidencia(registerDto!)
            .then((tipoIncidencia) => res.json(tipoIncidencia))
            .catch(error => this.handleError(error, res))
    }


    getAllSubTipoIncidenciaByTipoIncidencia = (req: Request, res: Response) => {
        const idTipo = req.query.idTipo as string;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const searchQuery = req.query.search as string || '';
        this.incidenciaService.getAllSubTipoIncidenciaByTipoIncidencia(idTipo, page, limit, searchQuery)
            .then((tipoIncidencia) => res.json(tipoIncidencia))
            .catch(error => this.handleError(error, res))
    }

    deleteSubTipoIncidenciaById = (req: Request, res: Response) => {
        const id = req.params.id;
        this.incidenciaService.deleteSubTipoIncidenciaById(id)
            .then((tipoIncidencia) => res.json(tipoIncidencia))
            .catch(error => this.handleError(error, res))
    }

    getSubTipoIncidenciaById = (req: Request, res: Response) => {
        const id = req.params.id;
        this.incidenciaService.getSubTipoIncidenciaById(id)
            .then((tipoIncidencia) => res.json(tipoIncidencia))
            .catch(error => this.handleError(error, res))
    }


    registerTicketSoporte = (req: Request, res: Response) => {
        const [error, registerDto] = RegisterTicketSoporteDto.create(req.body);
        if (error) return res.status(400).json({ error });

        this.incidenciaService.registerTicketSoporte(registerDto!)
            .then((ticketSoporte) => res.json(ticketSoporte))
            .catch(error => this.handleError(error, res))
    }

    updateTicketSoporte = (req: Request, res: Response) => {
        const [error, registerDto] = RegisterTicketSoporteDto.create(req.body);
        if (error) return res.status(400).json({ error });


        this.incidenciaService.updateTicketSoporte(registerDto!)
            .then((ticketSoporte) => res.json(ticketSoporte))
            .catch(error => this.handleError(error, res))
    }

    getAllTicketSoporte = (req: Request, res: Response) => {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const searchQuery = req.query.search as string || '';

        this.incidenciaService.getAllTicketSoporte(page, limit, searchQuery)
            .then((ticketSoporte) => res.json(ticketSoporte))
            .catch(error => this.handleError(error, res))
    }

    deleteTicketSoporteById = (req: Request, res: Response) => {
        const id = req.params.id;
        this.incidenciaService.deleteTicketSoporteById(id)
            .then((ticketSoporte) => res.json(ticketSoporte))
            .catch(error => this.handleError(error, res))
    }

    getTicketSoporteById = (req: Request, res: Response) => {
        const id = req.params.id;
        this.incidenciaService.getTicketSoporteById(id)
            .then((ticketSoporte) => res.json(ticketSoporte))
            .catch(error => this.handleError(error, res))
    }

}
