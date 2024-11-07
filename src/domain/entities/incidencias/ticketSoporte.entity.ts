import { Types } from 'mongoose';
import { CustomError } from '../../errors/custom.error';
import { TipoIncidenciaEntity } from './tipoIncidencia.entity';
import { SubTipoIncidenciaEntity } from './subTipoIncidencia.entity';
import { UserEntity } from '../../';


export class TicketSoporteEntity {

    constructor(
        public tipoIncidenciaId: Types.ObjectId,
        public subTipoIncidenciaId: Types.ObjectId,
        public descripcion: string,
        public cedulaCliente: string,
        public userId: Types.ObjectId,
        public estatus: string,
        public fecha: Date,
        public tipoDetails?: TipoIncidenciaEntity,
        public subTipoDetails?: SubTipoIncidenciaEntity,
        public userDetails?: UserEntity,
        public id?: string
    ) { }

    static fromObject(object: { [key: string]: any; }) {
        const { id, _id, tipoIncidenciaId, subTipoIncidenciaId, descripcion, cedulaCliente, userId, estatus, fecha, tipoDetails, subTipoDetails, userDetails } = object;

        if (!_id && !id) {
            throw CustomError.badRequest('Missing id');
        }

        if (!tipoIncidenciaId) throw CustomError.badRequest('Missing tipoIncidenciaId');
        if (!subTipoIncidenciaId) throw CustomError.badRequest('Missing subTipoIncidenciaId');
        if (!descripcion) throw CustomError.badRequest('Missing descripcion');
        if (!cedulaCliente) throw CustomError.badRequest('Missing cedulaCliente');
        if (!userId) throw CustomError.badRequest('Missing userId');
        if (!estatus) throw CustomError.badRequest('Missing estatus');
        if (!fecha) throw CustomError.badRequest('Missing fecha');

        return new TicketSoporteEntity(tipoIncidenciaId, subTipoIncidenciaId, descripcion, cedulaCliente, userId, estatus,
             fecha.toLocaleString("es-VE", {timeZone: "America/Caracas"}), tipoDetails, subTipoDetails, userDetails, _id || id);
    }
}