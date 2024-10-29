import { RegisterTicketSoporteDto, TicketSoportEntity } from "../..";

export abstract class TicketSoporteDatasource {
    abstract insertTicketSoporte(registerTipoIncidenciaDto: RegisterTicketSoporteDto): Promise<TicketSoportEntity>;
    abstract updateTicketSoporte(registerSubTipoIncidenciaDto: RegisterTicketSoporteDto): Promise<TicketSoportEntity>;
    abstract getTicketSoporteById(id: string): Promise<TicketSoportEntity>;
    abstract getAllTicketSoporte(page: number, limit: number, searchQuery: string): Promise<{ listaTipos: TicketSoportEntity[], currentPage: number, totalPages: number }>;
    abstract deleteTicketSoporteById(id: string): Promise<boolean>;
    abstract getTicketSoporteForRegistration(registerTipoIncidenciaDto: RegisterTicketSoporteDto): Promise<TicketSoportEntity | null>;
}