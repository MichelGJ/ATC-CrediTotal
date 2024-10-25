import { RegisterTipoIncidenciaDto, TipoIncidenciaDatasource, TipoIncidenciaEntity, TipoIncidenciaRepository } from "../../../domain";

export class TipoIncidenciaRepositoryImpl implements TipoIncidenciaRepository {

    constructor(
        private readonly tipoIncidenciaDatasource: TipoIncidenciaDatasource
    ) { }

    insertTipoIncidencia(registerTipoIncidenciaDto: RegisterTipoIncidenciaDto): Promise<TipoIncidenciaEntity> {
        return this.tipoIncidenciaDatasource.insertTipoIncidencia(registerTipoIncidenciaDto);
    }

    updateTipoIncidencia(registerTipoIncidenciaDto: RegisterTipoIncidenciaDto): Promise<TipoIncidenciaEntity> {
        return this.tipoIncidenciaDatasource.updateTipoIncidencia(registerTipoIncidenciaDto);
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

    getTipoIncidenciaForRegistration(registerUserDto: RegisterTipoIncidenciaDto): Promise<TipoIncidenciaEntity | null> {
        return this.tipoIncidenciaDatasource.getTipoIncidenciaForRegistration(registerUserDto);
    }


}