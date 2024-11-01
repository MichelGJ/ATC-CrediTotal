import { RegisterTicketSoporteDto, TicketSoporteDatasource, TicketSoporteEntity, TicketSoporteRepository } from "../../../domain";

export class TicketSoporteRepositoryImpl implements TicketSoporteRepository {

    constructor(
        private readonly TicketSoporteDatasource: TicketSoporteDatasource
    ) { }

    insertTicketSoporte(registerTicketSoporteDto: RegisterTicketSoporteDto): Promise<TicketSoporteEntity> {
        return this.TicketSoporteDatasource.insertTicketSoporte(registerTicketSoporteDto);
    }

    updateTicketSoporte(registerTicketSoporteDto: RegisterTicketSoporteDto): Promise<TicketSoporteEntity> {
        return this.TicketSoporteDatasource.updateTicketSoporte(registerTicketSoporteDto);
    }

    getTicketSoporteById(id: string): Promise<TicketSoporteEntity> {
        return this.TicketSoporteDatasource.getTicketSoporteById(id)
    }

    getAllTicketSoporte(page: number, limit: number, searchQuery: string): Promise<{ listaTickets: TicketSoporteEntity[], currentPage: number, totalPages: number }> {
        return this.TicketSoporteDatasource.getAllTicketSoporte(page, limit, searchQuery);
    }

    deleteTicketSoporteById(id: string): Promise<boolean> {
        return this.TicketSoporteDatasource.deleteTicketSoporteById(id);
    }

    getTicketSoporteForRegistration(registerUserDto: RegisterTicketSoporteDto): Promise<TicketSoporteEntity | null> {
        return this.TicketSoporteDatasource.getTicketSoporteForRegistration(registerUserDto);
    }

    closeTicketSoporte(id: string): Promise<boolean>{
        return this.TicketSoporteDatasource.closeTicketSoporte(id);
    };



}