import { TicketSoporteModel } from "../../../data/mongo";
import { CustomError, RegisterTicketSoporteDto, TicketSoporteDatasource, TicketSoporteEntity } from "../../../domain";


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

    await ticketSoporte.save();

    const { ...ticketSoporteEntity } = TicketSoporteEntity.fromObject(ticketSoporte);

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

  async getAllTicketSoporte(page: number, limit: number, searchQuery: string): Promise<{ listaTipos: TicketSoporteEntity[]; currentPage: number; totalPages: number; }> {
    const skip = (page - 1) * limit;

    const searchCondition = searchQuery
      ? {
        $or: [
          { name: { $regex: searchQuery, $options: 'i' } }
        ]
      }
      : {};

    const totalTiposIncidencia = await TicketSoporteModel.countDocuments(searchCondition);

    const totalPages = Math.ceil(totalTiposIncidencia / limit);

    const tiposIncidencias = await TicketSoporteModel.aggregate([
      { $match: searchCondition },
      { $skip: skip },   
      { $limit: limit }      
    ]);

    const listaTipos = tiposIncidencias.map(tipo => TicketSoporteEntity.fromObject(tipo));
    return {
      listaTipos,
      currentPage: page,
      totalPages
    };
  }

  
  async deleteTicketSoporteById(id: string): Promise<boolean> {
    const user = await TicketSoporteModel.deleteOne({ _id: id });
    return user.acknowledged;
  }
}