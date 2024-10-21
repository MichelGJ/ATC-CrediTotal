import { CustomError } from '../errors/custom.error';


export class RoleEntity {

    constructor(
        public id: string,
        public nombre: string,
        public permisos: string[],
    ) { }

    static fromObject(object: { [key: string]: any; }) {
        const { id, _id, nombre, permisos } = object;

        if (!_id && !id) {
            throw CustomError.badRequest('Missing id');
        }

        if (!nombre) throw CustomError.badRequest('Missing nombre');
        if (!permisos) throw CustomError.badRequest('Missing permisos');

        return new RoleEntity(_id || id, nombre, permisos);
    }
}