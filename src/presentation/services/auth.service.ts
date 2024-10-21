import { JwtAdapter, bcryptAdapter, envs } from '../../config';
import { UserModel, RoleModel } from '../../data';
import { CustomError, LoginUserDto, RegisterUserDto, UserEntity, RoleEntity, RoleRepository } from '../../domain';
import { EmailService } from './email.service';




export class AuthService {

  // DI
  constructor(
    private readonly roleRepository: RoleRepository,
    private readonly emailService: EmailService,
    // webServiceUrl: string,
  ) { }


  public async registerUser(registerUserDto: RegisterUserDto) {

    try {
      const existUser = await UserModel.findOne({
        $or: [
          { email: registerUserDto.email },
          { cedula: registerUserDto.cedula }
        ]
      });

      if (existUser) {
        if (existUser.email === registerUserDto.email) {
          throw CustomError.badRequest('Email ya existe');
        }
        if (existUser.cedula === registerUserDto.cedula) {
          throw CustomError.badRequest('Cédula ya existe');
        }
      }
      const user = new UserModel(registerUserDto);


      // Encriptar la contraseña
      user.password = bcryptAdapter.hash(registerUserDto.password);

      await user.save();
      // JWT <---- para mantener la autenticación del usuario

      // // Email de confirmación
      // await this.sendEmailValidationLink(user.email);

      const { password, ...userEntity } = UserEntity.fromObject(user);


      const token = await JwtAdapter.generateToken({ id: user.id });
      if (!token) throw CustomError.internalServer('Error while creating JWT');


      return {
        user: userEntity,
        token: token
      };

    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }

  }


  public async loginUser(loginUserDto: LoginUserDto) {
    const email = loginUserDto.email;
    const userWithRole = await UserModel.aggregate([
      {
        $match: { email }
      },
      {
        $lookup: {
          from: 'roles',        
          localField: 'role',    
          foreignField: '_id',   
          as: 'roleDetails'      
        }
      },
      { $unwind: '$roleDetails' }
    ]);

    if (!userWithRole || userWithRole.length === 0) throw CustomError.badRequest('Correo inválido');

    const user = userWithRole[0];

    const isMatching = bcryptAdapter.compare(loginUserDto.password, user.password);
    if (!isMatching) throw CustomError.badRequest('Contraseña invalida');


    const { password, ...userEntity } = UserEntity.fromObject(user);

    const token = await JwtAdapter.generateToken({ id: user.id, name: user.name, role: user.roleDetails.nombre, permisos: user.roleDetails.permisos });
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

  private sendEmailValidationLink = async (email: string) => {

    const token = await JwtAdapter.generateToken({ email });
    if (!token) throw CustomError.internalServer('Error getting token');

    const link = `${envs.WEBSERVICE_URL}/auth/validate-email/${token}`;
    const html = `
      <h1>Validate your email</h1>
      <p>Click on the following link to validate your email</p>
      <a href="${link}">Validate your email: ${email}</a>
    `;

    const options = {
      to: email,
      subject: 'Validate your email',
      htmlBody: html,
    }

    const isSent = await this.emailService.sendEmail(options);
    if (!isSent) throw CustomError.internalServer('Error sending email');

    return true;
  }


  // public validateEmail = async (token: string) => {

  //   const payload = await JwtAdapter.validateToken(token);
  //   if (!payload) throw CustomError.unauthorized('Invalid token');

  //   const { email } = payload as { email: string };
  //   if (!email) throw CustomError.internalServer('Email not in token');

  //   const user = await UserModel.findOne({ email });
  //   if (!user) throw CustomError.internalServer('Email not exists');

  //   user.emailValidated = true;
  //   await user.save();

  //   return true;
  // }


}