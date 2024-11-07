import { RegisterTicketPresencialDto, UpdateTicketPresencialDto,TicketPresencialEntity } from "../..";

export abstract class TicketPresencialRepository {
    abstract insertTicketPresencial(registerTicketPresencialDto: RegisterTicketPresencialDto): Promise<TicketPresencialEntity>;
    abstract updateTicketPresencial(updateTicketPresencialDto: UpdateTicketPresencialDto): Promise<TicketPresencialEntity>;
    abstract getTicketPresencialById(id: string): Promise<TicketPresencialEntity>;
    abstract getAllTicketPresencial(page: number, limit: number, searchQuery: string): Promise<{ listaTickets: TicketPresencialEntity[], currentPage: number, totalPages: number }>;
    abstract deleteTicketPresencialById(id: string): Promise<boolean>;
}