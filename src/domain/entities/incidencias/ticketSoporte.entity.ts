import { Types } from 'mongoose';
import { CustomError } from '../../errors/custom.error';


export class TicketSoporteEntity {

    constructor(
        public tipoIncidenciaId:  Types.ObjectId,
        public subTipoIncidenciaId:  Types.ObjectId,
        public descripcion: string,
        public cedulaCliente: string,
        public userId:  Types.ObjectId,
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

        return new TicketSoporteEntity(tipoIncidenciaId,  subTipoIncidenciaId, descripcion, cedulaCliente, userId, estatus, _id || id);
    }
}