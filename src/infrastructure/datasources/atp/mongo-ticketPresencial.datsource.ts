import { TicketPresencialModel } from "../../../data/mongo";
import { CustomError, RegisterTicketPresencialDto, UpdateTicketPresencialDto,TicketPresencialDatasource, TicketPresencialEntity } from "../../../domain";
import { envs } from '../../../config/envs';


export class MongoTicketPresencialDatasource implements TicketPresencialDatasource {


    async insertTicketPresencial(registerTicketPresencialDto: RegisterTicketPresencialDto): Promise<TicketPresencialEntity> {
        const ticketPresencial = new TicketPresencialModel(registerTicketPresencialDto);
        ticketPresencial.fechaInicio = new Date();

        const ticketPresencialInserted = await ticketPresencial.save();

        const { ...ticketPresencialEntity } = TicketPresencialEntity.fromObject(ticketPresencialInserted);

        return ticketPresencialEntity;
    }

    async updateTicketPresencial(updateTicketPresencialDto: UpdateTicketPresencialDto): Promise<TicketPresencialEntity> {
        const { ...ticketPresencialData } = updateTicketPresencialDto;

        let ticketPresencial;

        ticketPresencial = await TicketPresencialModel.findById(ticketPresencialData.id);
        if (!ticketPresencial) throw CustomError.badRequest('ticketPresencial no existe');

        ticketPresencial.set(ticketPresencialData);
        ticketPresencial.fechaFin = new Date();

        await ticketPresencial.save();

        const { ...ticketPresencialEntity } = TicketPresencialEntity.fromObject(ticketPresencial);

        return ticketPresencialEntity;
    }

    async getTicketPresencialById(id: string): Promise<TicketPresencialEntity> {
        const ticketPresencial = await TicketPresencialModel.findById(id);

        if (!ticketPresencial) throw CustomError.badRequest('ticketPresencial no existe');

        return ticketPresencial;
    }

    async getAllTicketPresencial(page: number, limit: number, searchQuery: string): Promise<{ listaTickets: TicketPresencialEntity[]; currentPage: number; totalPages: number; }> {
        const skip = (page - 1) * limit;

        // Define the search condition, accounting for joined fields
        const searchCondition = searchQuery
            ? {
                $or: [
                    { descripcion: { $regex: searchQuery, $options: 'i' } },
                    { cedulaCliente: { $regex: searchQuery, $options: 'i' } },
                    { resultado: { $regex: searchQuery, $options: 'i' } },
                    { fechaInicio: { $regex: searchQuery, $options: 'i' } },
                    { fechaFin: { $regex: searchQuery, $options: 'i' } },
                ]
            }
            : {};

        const ticketsPresencial = await TicketPresencialModel.aggregate([
            { $match: searchCondition },
            { $skip: skip },
            { $limit: limit }
        ]);

        const totalTicketsPresencial = await TicketPresencialModel.countDocuments(searchCondition);
        
        const totalPages = limit ? Math.ceil(totalTicketsPresencial / limit) : 1;
        const listaTickets = ticketsPresencial.map(ticket => TicketPresencialEntity.fromObject(ticket));

        return {
            listaTickets,
            currentPage: page,
            totalPages
        };
    }

    async deleteTicketPresencialById(id: string): Promise<boolean> {
        const ticketDeleted = await TicketPresencialModel.deleteOne({ _id: id });
        return ticketDeleted.acknowledged;
    }
}