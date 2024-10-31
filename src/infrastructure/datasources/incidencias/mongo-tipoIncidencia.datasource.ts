import { TipoIncidenciaModel } from "../../../data/mongo";
import { CustomError, RegisterTipoIncidenciaDto, TipoIncidenciaDatasource, TipoIncidenciaEntity } from "../../../domain";

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
    if (!tipoIncidencia) throw CustomError.badRequest('TipoIncidencia no existe');

    tipoIncidencia.set(tipoIncidenciaData);

    await tipoIncidencia.save();

    const { ...tipoIncidenciaEntity } = TipoIncidenciaEntity.fromObject(tipoIncidencia);

    return tipoIncidenciaEntity;
  }

  async getTipoIncidenciaById(id: string): Promise<TipoIncidenciaEntity> {
    const tipoIncidencia = await TipoIncidenciaModel.findById(id);
  
      if (!tipoIncidencia) throw CustomError.badRequest('TipoIncidencia no existe');

      return tipoIncidencia;
  }

  async getAllTipoIncidencia(
  page: number = 1,
  limit: number | null = null,
  searchQuery: string
): Promise<{ listaTipos: TipoIncidenciaEntity[]; currentPage: number; totalPages: number }> {
  
  const skip = (page - 1) * (limit ?? 0);

  const searchCondition = searchQuery
    ? { $or: [{ name: { $regex: searchQuery, $options: 'i' } }] }
    : {};

  const totalTiposIncidencia = await TipoIncidenciaModel.countDocuments(searchCondition);

  const totalPages = limit ? Math.ceil(totalTiposIncidencia / limit) : 1;

  // Construct aggregation pipeline
  const aggregationPipeline: any[] = [
    { $match: searchCondition },
    { $skip: skip }
  ];

  // Conditionally add $limit if limit is provided
  if (limit || limit) {
    aggregationPipeline.push({ $limit: limit });
  }

  // Execute the aggregation
  const tiposIncidencias = await TipoIncidenciaModel.aggregate(aggregationPipeline);

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