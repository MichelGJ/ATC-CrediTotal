import { SubTipoIncidenciaModel } from "../../../data/mongo";
import { CustomError, RegisterSubTipoIncidenciaDto, SubTipoIncidenciaDatasource, SubTipoIncidenciaEntity } from "../../../domain";
import { Types } from "mongoose";

export class MongoSubTipoIncidenciaDatasource implements SubTipoIncidenciaDatasource {


  async getSubTipoIncidenciaForRegistration(registerSubTipoIncidenciaDto: RegisterSubTipoIncidenciaDto): Promise<SubTipoIncidenciaEntity | null> {
    return await SubTipoIncidenciaModel.findOne({
      $or: [
        { name: { $regex: new RegExp(registerSubTipoIncidenciaDto.name, 'i') } }
      ]
    });
  }


  async insertSubTipoIncidencia(registerSubTipoIncidenciaDto: RegisterSubTipoIncidenciaDto): Promise<SubTipoIncidenciaEntity> {
    const tipoIncidencia = new SubTipoIncidenciaModel(registerSubTipoIncidenciaDto);

    await tipoIncidencia.save();

    const { ...tipoIncidenciaEntity } = SubTipoIncidenciaEntity.fromObject(tipoIncidencia);

    return tipoIncidenciaEntity;
  }

  async updateSubTipoIncidencia(registerSubTipoIncidenciaDto: RegisterSubTipoIncidenciaDto): Promise<SubTipoIncidenciaEntity> {
    const { ...tipoIncidenciaData } = registerSubTipoIncidenciaDto;

    let tipoIncidencia;

    tipoIncidencia = await SubTipoIncidenciaModel.findById(tipoIncidenciaData.id);
    if (!tipoIncidencia) throw CustomError.badRequest('SubTipoIncidencia no existe');

    tipoIncidencia.set(tipoIncidenciaData);

    await tipoIncidencia.save();

    const { ...tipoIncidenciaEntity } = SubTipoIncidenciaEntity.fromObject(tipoIncidencia);

    return tipoIncidenciaEntity;
  }

  async getSubTipoIncidenciaById(id: string): Promise<SubTipoIncidenciaEntity> {
    const tipoIncidencia = await SubTipoIncidenciaModel.findById(id);

    if (!tipoIncidencia) throw CustomError.badRequest('SubTipoIncidencia no existe');

    return tipoIncidencia;
  }

  async getAllSubTipoIncidenciaByTipoIncidencia(idTipo: string, page: number, limit: number, searchQuery: string): Promise<{ listaSubTipos: SubTipoIncidenciaEntity[], currentPage: number, totalPages: number }> {
    const skip = (page - 1) * limit;

    const searchCondition = {
      $and: [
        { tipoIncidenciaId: new Types.ObjectId(idTipo) },
        searchQuery
          ? { name: { $regex: searchQuery, $options: 'i' } }
          : {}
      ]
    };

    const totalTiposIncidencia = await SubTipoIncidenciaModel.countDocuments(searchCondition);

    const totalPages = Math.ceil(totalTiposIncidencia / limit);

    const tiposIncidencias = await SubTipoIncidenciaModel.aggregate([
      { $match: searchCondition },
      {
        $lookup: {
          from: 'tipo_incidencias',
          localField: 'tipoIncidenciaId',
          foreignField: '_id',
          as: 'tipoDetails'
        }
      },
      { $unwind: '$tipoDetails' },
      { $skip: skip },
      { $limit: limit }
    ]);

    const listaSubTipos = tiposIncidencias.map(tipo => SubTipoIncidenciaEntity.fromObject(tipo));
    return {
      listaSubTipos,
      currentPage: page,
      totalPages
    };
  }


  async deleteSubTipoIncidenciaById(id: string): Promise<boolean> {
    const user = await SubTipoIncidenciaModel.deleteOne({ _id: id });
    return user.acknowledged;
  }
}