import { RegisterSubTipoIncidenciaDto, SubTipoIncidenciaDatasource, SubTipoIncidenciaEntity, SubTipoIncidenciaRepository } from "../../../domain";

export class SubTipoIncidenciaRepositoryImpl implements SubTipoIncidenciaRepository {

    constructor(
        private readonly tipoIncidenciaDatasource: SubTipoIncidenciaDatasource
    ) { }

    insertSubTipoIncidencia(registerTipoIncidenciaDto: RegisterSubTipoIncidenciaDto): Promise<SubTipoIncidenciaEntity> {
        return this.tipoIncidenciaDatasource.insertSubTipoIncidencia(registerTipoIncidenciaDto);
    }

    updateSubTipoIncidencia(registerTipoIncidenciaDto: RegisterSubTipoIncidenciaDto): Promise<SubTipoIncidenciaEntity> {
        return this.tipoIncidenciaDatasource.updateSubTipoIncidencia(registerTipoIncidenciaDto);
    }

    getSubTipoIncidenciaById(id: string): Promise<SubTipoIncidenciaEntity> {
        return this.tipoIncidenciaDatasource.getSubTipoIncidenciaById(id)
    }

    getAllSubTipoIncidenciaByTipoIncidencia(id: string, page: number, limit: number,searchQuery: string):Promise<{ listaSubTipos: SubTipoIncidenciaEntity[], currentPage: number, totalPages: number }> {
        return this.tipoIncidenciaDatasource.getAllSubTipoIncidenciaByTipoIncidencia(id, page, limit, searchQuery);
    }

    deleteSubTipoIncidenciaById(id: string): Promise<boolean> {
        return this.tipoIncidenciaDatasource.deleteSubTipoIncidenciaById(id);
    }

    getSubTipoIncidenciaForRegistration(registerUserDto: RegisterSubTipoIncidenciaDto): Promise<SubTipoIncidenciaEntity | null> {
        return this.tipoIncidenciaDatasource.getSubTipoIncidenciaForRegistration(registerUserDto);
    }


}