import { Types } from 'mongoose';
import { CustomError } from '../../errors/custom.error';
import { TipoIncidenciaEntity } from './tipoIncidencia.entity';


export class SubTipoIncidenciaEntity {

  constructor(
    public name: string,
    public tipoIncidenciaId: Types.ObjectId,
    public tipoDetails?: TipoIncidenciaEntity,
    public id?: string,
  ) { }

  static fromObject(object: { [key: string]: any; }) {
    const { id, _id, name, tipoIncidenciaId, tipoDetails} = object;

    if (!_id && !id) {
      throw CustomError.badRequest('Missing id');
    }

    if (!name) throw CustomError.badRequest('Missing name');
    if (!tipoIncidenciaId) throw CustomError.badRequest('Missing tipoIncidencia');
    

    return new SubTipoIncidenciaEntity(name, tipoIncidenciaId, tipoDetails,_id || id);
  }
}