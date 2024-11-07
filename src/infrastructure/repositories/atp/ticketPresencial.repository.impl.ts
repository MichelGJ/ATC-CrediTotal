import { RegisterTicketPresencialDto, UpdateTicketPresencialDto, TicketPresencialDatasource, TicketPresencialEntity, TicketPresencialRepository } from "../../../domain";

export class TicketPresencialRepositoryImpl implements TicketPresencialRepository {

    constructor(
        private readonly TicketPresencialDatasource: TicketPresencialDatasource
    ) { }

    insertTicketPresencial(registerTicketPresencialDto: RegisterTicketPresencialDto): Promise<TicketPresencialEntity> {
        return this.TicketPresencialDatasource.insertTicketPresencial(registerTicketPresencialDto);
    }

    updateTicketPresencial(updateTicketPresencialDto: UpdateTicketPresencialDto): Promise<TicketPresencialEntity> {
        return this.TicketPresencialDatasource.updateTicketPresencial(updateTicketPresencialDto);
    }

    getTicketPresencialById(id: string): Promise<TicketPresencialEntity> {
        return this.TicketPresencialDatasource.getTicketPresencialById(id)
    }

    getAllTicketPresencial(page: number, limit: number, searchQuery: string): Promise<{ listaTickets: TicketPresencialEntity[], currentPage: number, totalPages: number }> {
        return this.TicketPresencialDatasource.getAllTicketPresencial(page, limit, searchQuery);
    }

    deleteTicketPresencialById(id: string): Promise<boolean> {
        return this.TicketPresencialDatasource.deleteTicketPresencialById(id);
    }
}