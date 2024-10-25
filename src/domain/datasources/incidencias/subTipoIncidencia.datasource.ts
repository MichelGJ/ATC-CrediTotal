import { RegisterSubTipoIncidenciaDto, SubTipoIncidenciaEntity } from "../..";

export abstract class SubTipoIncidenciaDatasource {
    abstract insertSubTipoIncidencia(registerSubTipoIncidenciaDto: RegisterSubTipoIncidenciaDto): Promise<SubTipoIncidenciaEntity>;
    abstract updateSubTipoIncidencia(registerSubTipoIncidenciaDto: RegisterSubTipoIncidenciaDto): Promise<SubTipoIncidenciaEntity>;
    abstract getSubTipoIncidenciaById(id: string): Promise<SubTipoIncidenciaEntity>;
    abstract getAllSubTipoIncidenciaByTipoIncidencia(id: string, page: number, limit: number, searchQuery: string): Promise<{ users: SubTipoIncidenciaEntity[], currentPage: number, totalPages: number }>;
    abstract getAllSubTipoIncidencia(page: number, limit: number, searchQuery: string): Promise<{ listaSubTipos: SubTipoIncidenciaEntity[], currentPage: number, totalPages: number }>;
    abstract deleteSubTipoIncidenciaById(id: string): Promise<boolean>;
}