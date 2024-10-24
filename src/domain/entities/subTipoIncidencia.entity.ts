import { Types } from 'mongoose';
import { CustomError } from '../errors/custom.error';


export class SubTipoIncidenciaEntity {

  constructor(
    public id: string,
    public name: string,
    public tipoIncidencia: Types.ObjectId,
  ) { }

  static fromObject(object: { [key: string]: any; }) {
    const { id, _id, name, tipoIncidencia} = object;

    if (!_id && !id) {
      throw CustomError.badRequest('Missing id');
    }

    if (!name) throw CustomError.badRequest('Missing name');
    if (!tipoIncidencia) throw CustomError.badRequest('Missing tipoIncidencia');
    

    return new SubTipoIncidenciaEntity(_id || id, name, tipoIncidencia);
  }
}