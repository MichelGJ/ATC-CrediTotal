import { Types } from 'mongoose';
import { CustomError } from '../../errors/custom.error';


export class SubTipoIncidenciaEntity {

  constructor(
    public name: string,
    public tipoIncidenciaId: Types.ObjectId,
    public id?: string,
  ) { }

  static fromObject(object: { [key: string]: any; }) {
    const { id, _id, name, tipoIncidenciaId} = object;

    if (!_id && !id) {
      throw CustomError.badRequest('Missing id');
    }

    if (!name) throw CustomError.badRequest('Missing name');
    if (!tipoIncidenciaId) throw CustomError.badRequest('Missing tipoIncidencia');
    

    return new SubTipoIncidenciaEntity(name, tipoIncidenciaId, _id || id);
  }
}