import { RegisterTicketSoporteDto, TicketSoporteEntity } from "../..";

export abstract class TicketSoporteDatasource {
    abstract insertTicketSoporte(registerTipoIncidenciaDto: RegisterTicketSoporteDto): Promise<TicketSoporteEntity>;
    abstract updateTicketSoporte(registerSubTipoIncidenciaDto: RegisterTicketSoporteDto): Promise<TicketSoporteEntity>;
    abstract getTicketSoporteById(id: string): Promise<TicketSoporteEntity>;
    abstract getAllTicketSoporte(page: number, limit: number, searchQuery: string): Promise<{ listaTickets: TicketSoporteEntity[], currentPage: number, totalPages: number }>;
    abstract deleteTicketSoporteById(id: string): Promise<boolean>;
    abstract getTicketSoporteForRegistration(registerTipoIncidenciaDto: RegisterTicketSoporteDto): Promise<TicketSoporteEntity | null>;
    abstract closeTicketSoporte(id: string): Promise<boolean>;
}