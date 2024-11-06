import { RegisterSubTipoIncidenciaDto, SubTipoIncidenciaDatasource, SubTipoIncidenciaEntity, SubTipoIncidenciaRepository } from "../../../domain";

export class SubTipoIncidenciaRepositoryImpl implements SubTipoIncidenciaRepository {

    constructor(
        private readonly subTipoIncidenciaDatasource: SubTipoIncidenciaDatasource
    ) { }

    insertSubTipoIncidencia(registerTipoIncidenciaDto: RegisterSubTipoIncidenciaDto): Promise<SubTipoIncidenciaEntity> {
        return this.subTipoIncidenciaDatasource.insertSubTipoIncidencia(registerTipoIncidenciaDto);
    }

    updateSubTipoIncidencia(registerTipoIncidenciaDto: RegisterSubTipoIncidenciaDto): Promise<SubTipoIncidenciaEntity> {
        return this.subTipoIncidenciaDatasource.updateSubTipoIncidencia(registerTipoIncidenciaDto);
    }

    getSubTipoIncidenciaById(id: string): Promise<SubTipoIncidenciaEntity> {
        return this.subTipoIncidenciaDatasource.getSubTipoIncidenciaById(id)
    }

    getAllSubTipoIncidenciaByTipoIncidencia(id: string, page: number, limit: number,searchQuery: string):Promise<{ listaSubTipos: SubTipoIncidenciaEntity[], currentPage: number, totalPages: number }> {
        return this.subTipoIncidenciaDatasource.getAllSubTipoIncidenciaByTipoIncidencia(id, page, limit, searchQuery);
    }

    deleteSubTipoIncidenciaById(id: string): Promise<boolean> {
        return this.subTipoIncidenciaDatasource.deleteSubTipoIncidenciaById(id);
    }

    getSubTipoIncidenciaForRegistration(registerUserDto: RegisterSubTipoIncidenciaDto): Promise<SubTipoIncidenciaEntity | null> {
        return this.subTipoIncidenciaDatasource.getSubTipoIncidenciaForRegistration(registerUserDto);
    }

    deleteSubTipoIncidenciaByTipoIncidencia(idTipo: string): Promise<boolean> {
        return this.subTipoIncidenciaDatasource.deleteSubTipoIncidenciaByTipoIncidencia(idTipo);
    }
}