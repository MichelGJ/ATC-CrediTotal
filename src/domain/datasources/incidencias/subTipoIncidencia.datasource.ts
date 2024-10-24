import { RegisterSubTipoIncidenciaDto, TipoIncidenciaEntity } from "../..";

export abstract class SubTipoIncidenciaDatasource {
    abstract insertSubTipoIncidencia(registerSubTipoIncidenciaDto: RegisterSubTipoIncidenciaDto): Promise<TipoIncidenciaEntity>;
    abstract updateSubTipoIncidencia(registerSubTipoIncidenciaDto: RegisterSubTipoIncidenciaDto): Promise<TipoIncidenciaEntity>;
    abstract getSubTipoIncidenciaById(id: string): Promise<TipoIncidenciaEntity>;
    abstract getAllSubTipoIncidenciaByTipoIncidencia(id: string, page: number, limit: number, searchQuery: string): Promise<{ users: TipoIncidenciaEntity[], currentPage: number, totalPages: number }>;
    abstract getAllSubTipoIncidencia(page: number, limit: number, searchQuery: string): Promise<{ users: TipoIncidenciaEntity[], currentPage: number, totalPages: number }>;
    abstract deleteSubTipoIncidenciaById(id: string): Promise<boolean>;
}