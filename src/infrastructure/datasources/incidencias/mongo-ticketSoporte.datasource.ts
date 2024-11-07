import { TicketSoporteModel } from "../../../data/mongo";
import { CustomError, RegisterTicketSoporteDto, TicketSoporteDatasource, TicketSoporteEntity } from "../../../domain";
import { envs } from '../../../config/envs';


export class MongoTicketSoporteDatasource implements TicketSoporteDatasource {


    async getTicketSoporteForRegistration(registerTicketSoporteDto: RegisterTicketSoporteDto): Promise<TicketSoporteEntity | null> {
        return await TicketSoporteModel.findOne({
            $or: [
                { name: { $regex: new RegExp(registerTicketSoporteDto.descripcion, 'i') } }
            ]
        });
    }


    async insertTicketSoporte(registerTicketSoporteDto: RegisterTicketSoporteDto): Promise<TicketSoporteEntity> {
        const ticketSoporte = new TicketSoporteModel(registerTicketSoporteDto);
        ticketSoporte.fecha = new Date();

        const ticketSoporteInserted = await ticketSoporte.save();

        const { ...ticketSoporteEntity } = TicketSoporteEntity.fromObject(ticketSoporteInserted);

        return ticketSoporteEntity;
    }

    async updateTicketSoporte(registerTicketSoporteDto: RegisterTicketSoporteDto): Promise<TicketSoporteEntity> {
        const { ...ticketSoporteData } = registerTicketSoporteDto;

        let ticketSoporte;

        ticketSoporte = await TicketSoporteModel.findById(ticketSoporteData.id);
        if (!ticketSoporte) throw CustomError.badRequest('ticketSoporte no existe');

        ticketSoporte.set(ticketSoporteData);

        await ticketSoporte.save();

        const { ...ticketSoporteEntity } = TicketSoporteEntity.fromObject(ticketSoporte);

        return ticketSoporteEntity;
    }

    async getTicketSoporteById(id: string): Promise<TicketSoporteEntity> {
        const ticketSoporte = await TicketSoporteModel.findById(id);

        if (!ticketSoporte) throw CustomError.badRequest('ticketSoporte no existe');

        return ticketSoporte;
    }

    async getAllTicketSoporte(page: number, limit: number, searchQuery: string): Promise<{ listaTickets: TicketSoporteEntity[]; currentPage: number; totalPages: number; }> {
        const skip = (page - 1) * limit;

        // Define the search condition, accounting for joined fields
        const searchCondition = searchQuery
            ? {
                $or: [
                    { descripcion: { $regex: searchQuery, $options: 'i' } },
                    { cedulaCliente: { $regex: searchQuery, $options: 'i' } },
                    { estatus: { $regex: searchQuery, $options: 'i' } },
                    { tipoNombre: { $regex: searchQuery, $options: 'i' } }, // Placeholder for joined field
                    { subTipoNombre: { $regex: searchQuery, $options: 'i' } }, // Placeholder for joined field
                    { userName: { $regex: searchQuery, $options: 'i' } } // Placeholder for joined field
                ]
            }
            : {};

        const ticketsSoporte = await TicketSoporteModel.aggregate([
            {
                $lookup: {
                    from: 'tipo_incidencias',
                    localField: 'tipoIncidenciaId',
                    foreignField: '_id',
                    as: 'tipoDetails'
                }
            },
            { $unwind: { path: '$tipoDetails', preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: 'subtipo_incidencias',
                    localField: 'subTipoIncidenciaId',
                    foreignField: '_id',
                    as: 'subTipoDetails'
                }
            },
            { $unwind: { path: '$subTipoDetails', preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'userDetails'
                }
            },
            { $unwind: { path: '$userDetails', preserveNullAndEmptyArrays: true } },
            // Add fields from lookups to the main document for easier matching
            {
                $addFields: {
                    tipoNombre: "$tipoDetails.name",
                    subTipoNombre: "$subTipoDetails.name",
                    userName: "$userDetails.name"
                }
            },
            // Apply match condition that includes both local and joined fields
            { $match: searchCondition },
            { $skip: skip },
            { $limit: limit }
        ]);

        const totalTicketsSoporte = await TicketSoporteModel.aggregate([
            {
                $lookup: {
                    from: 'tipo_incidencias',
                    localField: 'tipoIncidenciaId',
                    foreignField: '_id',
                    as: 'tipoDetails'
                }
            },
            { $unwind: { path: '$tipoDetails', preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: 'subtipo_incidencias',
                    localField: 'subTipoIncidenciaId',
                    foreignField: '_id',
                    as: 'subTipoDetails'
                }
            },
            { $unwind: { path: '$subTipoDetails', preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'userDetails'
                }
            },
            { $unwind: { path: '$userDetails', preserveNullAndEmptyArrays: true } },
            {
                $addFields: {
                    tipoNombre: "$tipoDetails.name",
                    subTipoNombre: "$subTipoDetails.name",
                    userName: "$userDetails.name"
                }
            },
            { $match: searchCondition },
            { $count: "total" }
        ]);

        const totalPages = totalTicketsSoporte[0] ? Math.ceil(totalTicketsSoporte[0].total / limit) : 0;
        const listaTickets = ticketsSoporte.map(ticket => TicketSoporteEntity.fromObject(ticket));

        return {
            listaTickets,
            currentPage: page,
            totalPages
        };
    }


    async deleteTicketSoporteById(id: string): Promise<boolean> {
        const ticketDeleted = await TicketSoporteModel.deleteOne({ _id: id });
        return ticketDeleted.acknowledged;
    }

    async closeTicketSoporte(id: string): Promise<boolean> {
        const ticketDeleted = await TicketSoporteModel.updateOne({ _id: id }, { $set: { "estatus": "Cerrado" } });
        return ticketDeleted.acknowledged;
    }
}