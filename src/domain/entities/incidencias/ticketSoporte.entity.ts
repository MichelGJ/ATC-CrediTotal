import { CustomError } from '../../errors/custom.error';


export class TicketSoportEntity {

    constructor(
        public tipoIncidenciaId: string,
        public subTipoIncidenciaId: string,
        public descripcion: string,
        public cedulaCliente: string,
        public userId: string,
        public estatus: string,
        public id?: string
    ) { }

    static fromObject(object: { [key: string]: any; }) {
        const { id, _id, tipoIncidenciaId,  subTipoIncidenciaId, descripcion, cedulaCliente, userId, estatus, } = object;

        if (!_id && !id) {
            throw CustomError.badRequest('Missing id');
        }

        if (!tipoIncidenciaId) throw CustomError.badRequest('Missing tipoIncidenciaId');
        if (!subTipoIncidenciaId) throw CustomError.badRequest('Missing subTipoIncidenciaId');
        if (!descripcion) throw CustomError.badRequest('Missing descripcion');
        if (!cedulaCliente) throw CustomError.badRequest('Missing cedulaCliente');
        if (!userId) throw CustomError.badRequest('Missing userId');
        if (!estatus) throw CustomError.badRequest('Missing estatus');

        return new TicketSoportEntity(tipoIncidenciaId,  subTipoIncidenciaId, descripcion, cedulaCliente, userId, estatus, _id || id);
    }
}