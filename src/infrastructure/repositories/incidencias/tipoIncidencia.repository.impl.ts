import { RegisterTipoIncidenciaDto, TipoIncidenciaDatasource, TipoIncidenciaEntity, TipoIncidenciaRepository } from "../../../domain";

export class TipoIncidenciaRepositoryImpl implements TipoIncidenciaRepository {

    constructor(
        private readonly tipoIncidenciaDatasource: TipoIncidenciaDatasource
    ) { }

    insertTipoIncidencia(registerUserDto: RegisterTipoIncidenciaDto): Promise<TipoIncidenciaEntity> {
        return this.tipoIncidenciaDatasource.insertTipoIncidencia(registerUserDto);
    }

    updateTipoIncidencia(UpdateUserDto: RegisterTipoIncidenciaDto): Promise<TipoIncidenciaEntity> {
        return this.tipoIncidenciaDatasource.updateTipoIncidencia(UpdateUserDto);
    }

    getTipoIncidenciaById(id: string): Promise<TipoIncidenciaEntity> {
        return this.tipoIncidenciaDatasource.getTipoIncidenciaById(id)
    }

    getAllTipoIncidencia(page: number, limit: number,searchQuery: string):Promise<{ listaTipos: TipoIncidenciaEntity[], currentPage: number, totalPages: number }> {
        return this.tipoIncidenciaDatasource.getAllTipoIncidencia(page, limit, searchQuery);
    }

    deleteTipoIncidenciaById(id: string): Promise<boolean> {
        return this.tipoIncidenciaDatasource.deleteTipoIncidenciaById(id);
    }

}