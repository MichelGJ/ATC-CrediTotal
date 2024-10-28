import { RegisterSubTipoIncidenciaDto, SubTipoIncidenciaEntity } from "../..";

export abstract class SubTipoIncidenciaRepository {
    abstract insertSubTipoIncidencia(registerSubTipoIncidenciaDto: RegisterSubTipoIncidenciaDto): Promise<SubTipoIncidenciaEntity>;
    abstract updateSubTipoIncidencia(registerSubTipoIncidenciaDto: RegisterSubTipoIncidenciaDto): Promise<SubTipoIncidenciaEntity>;
    abstract getSubTipoIncidenciaById(id: string): Promise<SubTipoIncidenciaEntity>;
    abstract getAllSubTipoIncidenciaByTipoIncidencia(idTipo: string, page: number, limit: number, searchQuery: string): Promise<{ listaSubTipos: SubTipoIncidenciaEntity[], currentPage: number, totalPages: number }>;
    // abstract getAllSubTipoIncidencia(page: number, limit: number, searchQuery: string): Promise<{ listaSubTipos: SubTipoIncidenciaEntity[], currentPage: number, totalPages: number }>;
    abstract deleteSubTipoIncidenciaById(id: string): Promise<boolean>;
    abstract getSubTipoIncidenciaForRegistration(registerTipoIncidenciaDto: RegisterSubTipoIncidenciaDto): Promise<SubTipoIncidenciaEntity | null>;
}