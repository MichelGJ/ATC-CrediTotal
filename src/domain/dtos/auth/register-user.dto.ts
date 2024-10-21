import { regularExps } from '../../../config';




export class RegisterUserDto {

  private constructor(
    public name: string,
    public cedula: string,
    public email: string,
    public password: string,
  ) {}

  static create( object: { [key:string]:any } ): [string?, RegisterUserDto?] {
    const { name, cedula, email, password } = object;

    if ( !name ) return ['Missing name'];
    if ( !cedula ) return ['Missing cedula'];
    if ( !email ) return ['Missing email'];
    if ( !regularExps.email.test( email ) ) return ['Email is not valid'];
    if ( !password ) return ['Missing password'];
    if ( password.length < 6 ) return ['Password too short'];

    return [undefined, new RegisterUserDto(name, cedula, email, password)];

  }

}