import { Types } from "mongoose";
import { TipoIncidenciaModel } from "../../../data/mongo";
import { CustomError, RegisterTipoIncidenciaDto, TipoIncidenciaDatasource, TipoIncidenciaEntity } from "../../../domain";
import { bcryptAdapter } from "../../../config";

export class MongoTipoIncidenciaDatasource implements TipoIncidenciaDatasource {


  async getTipoIncidenciaForRegistration(registerTipoIncidenciaDto: RegisterTipoIncidenciaDto): Promise<TipoIncidenciaEntity | null> {
    return await TipoIncidenciaModel.findOne({
      $or: [
        { name: { $regex: new RegExp(registerTipoIncidenciaDto.name, 'i') } }
      ]
    });
  }


  async insertTipoIncidencia(registerTipoIncidenciaDto: RegisterTipoIncidenciaDto): Promise<TipoIncidenciaEntity> {
    const tipoIncidencia = new TipoIncidenciaModel(registerTipoIncidenciaDto);

    await tipoIncidencia.save();

    const { ...tipoIncidenciaEntity } = TipoIncidenciaEntity.fromObject(tipoIncidencia);

    return tipoIncidenciaEntity;
  }

  async updateTipoIncidencia(registerTipoIncidenciaDto: RegisterTipoIncidenciaDto): Promise<TipoIncidenciaEntity> {
    const { ...tipoIncidenciaData } = registerTipoIncidenciaDto;

    let tipoIncidencia;

    tipoIncidencia = await TipoIncidenciaModel.findById(tipoIncidenciaData.id);
    if (!tipoIncidencia) throw CustomError.badRequest('User not found');

    tipoIncidencia.set(tipoIncidenciaData);

    await tipoIncidencia.save();

    const { ...tipoIncidenciaEntity } = TipoIncidenciaEntity.fromObject(tipoIncidencia);

    return tipoIncidenciaEntity;
  }

  async getTipoIncidenciaById(id: string): Promise<TipoIncidenciaEntity> {
    const tipoIncidencia = await TipoIncidenciaModel.findById(id);
  
      if (!tipoIncidencia) throw CustomError.badRequest('Usuario no existe');

      return tipoIncidencia;
  }

  async getAllTipoIncidencia(page: number, limit: number, searchQuery: string): Promise<{ listaTipos: TipoIncidenciaEntity[]; currentPage: number; totalPages: number; }> {
    const skip = (page - 1) * limit;

    const searchCondition = searchQuery
      ? {
        $or: [
          { name: { $regex: searchQuery, $options: 'i' } }
        ]
      }
      : {};

    const totalTiposIncidencia = await TipoIncidenciaModel.countDocuments(searchCondition);

    const totalPages = Math.ceil(totalTiposIncidencia / limit);

    const tiposIncidencias = await TipoIncidenciaModel.aggregate([
      { $match: searchCondition },
      { $skip: skip },   
      { $limit: limit }      
    ]);

    const listaTipos = tiposIncidencias.map(tipo => TipoIncidenciaEntity.fromObject(tipo));
    return {
      listaTipos,
      currentPage: page,
      totalPages
    };
  }

  
  async deleteTipoIncidenciaById(id: string): Promise<boolean> {
    const user = await TipoIncidenciaModel.deleteOne({ _id: id });
    return user.acknowledged;
  }
}