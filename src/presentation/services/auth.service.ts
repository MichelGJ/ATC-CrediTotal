import { JwtAdapter, bcryptAdapter, envs } from '../../config';
import { CustomError, LoginUserDto, RegisterUserDto, UserEntity, RoleRepository, UserRepository } from '../../domain';
import { EmailService } from './email.service';
import { WssService } from './wss.services';



export class AuthService {

  // DI
  constructor(
    private readonly roleRepository: RoleRepository,
    private readonly userRepository: UserRepository,
    private readonly emailService: EmailService,
    // webServiceUrl: string,
  ) { }


  public async registerUser(registerUserDto: RegisterUserDto) {

    try {
      const existUser = await this.userRepository.getUserForRegistration(registerUserDto);

      if (existUser) {
        if (existUser.email === registerUserDto.email) {
          throw CustomError.badRequest('Email ya existe');
        }
        if (existUser.cedula === registerUserDto.cedula) {
          throw CustomError.badRequest('Cédula ya existe');
        }
      }

      const userEntity = await this.userRepository.insertUser(registerUserDto);


      const token = await JwtAdapter.generateToken({ id: userEntity.id });
      if (!token) throw CustomError.internalServer('Error while creating JWT');

      WssService.instance.sendMessage('newUser', userEntity);

      return {
        user: userEntity,
        token: token
      };

    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }

  }

  public async updateUser(registerUserDto: RegisterUserDto) {
    try {

      const existUser = await this.userRepository.getUserForRegistration(registerUserDto);

      if (existUser) {
        if (existUser.id !== registerUserDto.id) {
          if (existUser.email === registerUserDto.email) {
            throw CustomError.badRequest('Email ya existe');
          }
          if (existUser.cedula === registerUserDto.cedula) {
            throw CustomError.badRequest('Cédula ya existe');
          }
        } else {

          const userEntity = await this.userRepository.updateUser(registerUserDto);
          WssService.instance.sendMessage('newUser', userEntity);

          return userEntity;
        }
      }
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }



  public async loginUser(loginUserDto: LoginUserDto) {
    const user = await this.userRepository.getUserForLogin(loginUserDto);
    
    const isMatching = bcryptAdapter.compare(loginUserDto.password, user.password);
    if (!isMatching) throw CustomError.badRequest('Contraseña invalida');


    const { ...userEntity } = UserEntity.fromObject(user);

    const token = await JwtAdapter.generateToken({ id: user.id, name: user.name, role: user.roleDetails?.nombre , permisos: user.roleDetails?.permisos });
    if (!token) throw CustomError.internalServer('Error while creating JWT');

    return {
      user: userEntity,
      token: token,
    }
  }

  public async getRoles() {
    const roles = await this.roleRepository.getRoles();
    return roles;
  }


  public async getUsers() {
    const users = await this.userRepository.getUsers();
    return users;
  }

  public async getUserById(id: string) {
    const users = await this.userRepository.getUserById(id);
    return users;
  }

  public async deleteUserById(id: string) {
    const users = await this.userRepository.deleteUserById(id);
    return users;
  }

}