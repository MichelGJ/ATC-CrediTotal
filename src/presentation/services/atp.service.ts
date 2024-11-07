import { JwtAdapter } from '../../config';
import { CustomError, RegisterTicketPresencialDto, TicketPresencialRepository, UpdateTicketPresencialDto } from '../../domain';
import { WssService } from './wss.services';

export class AtpService {

    // DI
    constructor(
        private readonly ticketPresencialRepository: TicketPresencialRepository,
        // webServiceUrl: string,
    ) { }


    public async registerTicketPresencial(registerTicketPresencialDto: RegisterTicketPresencialDto) {

        try {
            const tipoIncidenciaEntity = await this.ticketPresencialRepository.insertTicketPresencial(registerTicketPresencialDto);


            const token = await JwtAdapter.generateToken({ id: tipoIncidenciaEntity.id });
            if (!token) throw CustomError.internalServer('Error while creating JWT');

            WssService.instance.sendMessage('newTickerPresencial', '');

            return {
                user: tipoIncidenciaEntity,
                token: token
            };

        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }

    }

    public async updateTicketPresencial(updateTicketPresencialDto: UpdateTicketPresencialDto) {
        try {
            const tipoIncidenciaEntity = await this.ticketPresencialRepository.updateTicketPresencial(updateTicketPresencialDto);
            WssService.instance.sendMessage('newTickerPresencial', '');

            return tipoIncidenciaEntity;

        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    public async getAllTicketPresencial(page: number, limit: number, searchQuery: string) {
        const tickets = await this.ticketPresencialRepository.getAllTicketPresencial(page, limit, searchQuery);
        return tickets;
    }

    public async getTicketPresencialById(id: string) {
        const tickets = await this.ticketPresencialRepository.getTicketPresencialById(id);
        return tickets;
    }

    public async deleteTicketPresencialById(id: string) {
        const tickets = await this.ticketPresencialRepository.deleteTicketPresencialById(id);
        return tickets;
    }

}