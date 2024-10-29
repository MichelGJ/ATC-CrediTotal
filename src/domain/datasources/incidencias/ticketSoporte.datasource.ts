import { RegisterTicketSoporteDto,TicketSoportEntity } from "../..";

export abstract class TicketSoporteDatasource {
    abstract insertTipoIncidencia(registerTipoIncidenciaDto: RegisterTicketSoporteDto): Promise<TicketSoportEntity>;
    abstract updateTipoIncidencia(registerSubTipoIncidenciaDto: RegisterTicketSoporteDto): Promise<TicketSoportEntity>;
    abstract getTipoIncidenciaById(id: string): Promise<TicketSoportEntity>;
    abstract getAllTipoIncidencia(page: number, limit: number, searchQuery: string):Promise<{ listaTipos: TicketSoportEntity[], currentPage: number, totalPages: number }>;
    abstract deleteTipoIncidenciaById(id: string): Promise<boolean>;
    abstract getTipoIncidenciaForRegistration(registerTipoIncidenciaDto: RegisterTicketSoporteDto): Promise<TicketSoportEntity | null>;
}