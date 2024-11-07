import { CustomError } from '../../errors/custom.error';



export class TicketPresencialEntity {

    constructor(
        public descripcion: string,
        public cedulaCliente: string,
        public resultado: string,
        public fechaInicio: Date,
        public fechaFin: Date,
        public id?: string
    ) { }

    static fromObject(object: { [key: string]: any; }) {
        const { id, _id, descripcion, cedulaCliente, resultado, fechaInicio, fechaFin} = object;

        if (!_id && !id) {
            throw CustomError.badRequest('Missing id');
        }
        
        if (!descripcion) throw CustomError.badRequest('Missing descripcion');
        if (!cedulaCliente) throw CustomError.badRequest('Missing cedulaCliente');
        if (!resultado) throw CustomError.badRequest('Missing resultado');
        if (!fechaInicio) throw CustomError.badRequest('Missing fechaInicio');
        if (!fechaFin) throw CustomError.badRequest('Missing fechaFin');

        return new TicketPresencialEntity( descripcion, cedulaCliente, resultado,
             fechaInicio.toLocaleString("es-VE", {timeZone: "America/Caracas"}), fechaFin.toLocaleString("es-VE", {timeZone: "America/Caracas"}),_id || id);
    }
}