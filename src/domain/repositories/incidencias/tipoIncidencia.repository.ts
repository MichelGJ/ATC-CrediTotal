import { RegisterSubTipoIncidenciaDto,TipoIncidenciaEntity } from "../..";

export abstract class TipoIncidenciaRepository {
    abstract insertTipoIncidencia(registerSubTipoIncidenciaDto: RegisterSubTipoIncidenciaDto): Promise<TipoIncidenciaEntity>;
    abstract updateTipoIncidencia(registerSubTipoIncidenciaDto: RegisterSubTipoIncidenciaDto): Promise<TipoIncidenciaEntity>;
    abstract getTipoIncidenciaById(id: string): Promise<TipoIncidenciaEntity>;
    abstract getAllTipoIncidencia(page: number, limit: number, searchQuery: string):Promise<{ users: TipoIncidenciaEntity[], currentPage: number, totalPages: number }>;
    abstract deleteTipoIncidenciaById(id: string): Promise<boolean>;
}