import { RegisterTipoIncidenciaDto,TipoIncidenciaEntity } from "../..";

export abstract class TipoIncidenciaRepository {
    abstract insertTipoIncidencia(registerTipoIncidenciaDto: RegisterTipoIncidenciaDto): Promise<TipoIncidenciaEntity>;
    abstract updateTipoIncidencia(registerTipoIncidenciaDto: RegisterTipoIncidenciaDto): Promise<TipoIncidenciaEntity>;
    abstract getTipoIncidenciaById(id: string): Promise<TipoIncidenciaEntity>;
    abstract getAllTipoIncidencia(page: number, limit: number, searchQuery: string):Promise<{ listaTipos: TipoIncidenciaEntity[], currentPage: number, totalPages: number }>;
    abstract deleteTipoIncidenciaById(id: string): Promise<boolean>
    abstract getTipoIncidenciaForRegistration(registerTipoIncidenciaDto: RegisterTipoIncidenciaDto): Promise<TipoIncidenciaEntity | null>;
}