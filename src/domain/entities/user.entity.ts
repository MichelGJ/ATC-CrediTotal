import { Types } from 'mongoose';
import { CustomError } from '../errors/custom.error';
import { RoleEntity } from './role.entity';


export class UserEntity {

  constructor(
    public id: string,
    public name: string,
    public cedula: string,
    public email: string,
    public password: string,
    public role: Types.ObjectId,
    public roleDetails?: RoleEntity
  ) { }

  static fromObject(object: { [key: string]: any; }) {
    const { id, _id, name, cedula, email, password, role, roleDetails} = object;

    if (!_id && !id) {
      throw CustomError.badRequest('Missing id');
    }

    if (!name) throw CustomError.badRequest('Missing name');
    if (!cedula) throw CustomError.badRequest('Missing cedula');
    if (!email) throw CustomError.badRequest('Missing email');
    if (!password) throw CustomError.badRequest('Missing password');
    if (!role) throw CustomError.badRequest('Missing role');

    return new UserEntity(_id || id, name, cedula, email, password, role, roleDetails);
  }
}