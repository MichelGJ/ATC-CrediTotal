import { CustomError } from '../errors/custom.error';


export class TipoIncidenciaEntity {

  constructor(
    public name: string,
    public id?: string,
  ) { }

  static fromObject(object: { [key: string]: any; }) {
    const { id, _id, name} = object;

    if (!_id && !id) {
      throw CustomError.badRequest('Missing id');
    }

    if (!name) throw CustomError.badRequest('Missing name');
    

    return new TipoIncidenciaEntity(name, _id || id);
  }
}