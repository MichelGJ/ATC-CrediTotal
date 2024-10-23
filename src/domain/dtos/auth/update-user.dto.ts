import { ObjectId } from 'mongoose';
import { regularExps } from '../../../config';




export class UpdateUserDto {

  private constructor(
    public id?:string,
    public name?: string,
    public cedula?: string,
    public email?: string,
    public password?: string,
    public role?: ObjectId,
  ) {}

  static create( object: { [key:string]:any } ): [string?, UpdateUserDto?] {
    const { id, name, cedula, email, password, role } = object;
 
    return [undefined, new UpdateUserDto(id, name, cedula, email, password, role)];

  }

}