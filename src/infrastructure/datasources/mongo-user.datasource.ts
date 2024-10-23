import { Types } from "mongoose";
import { UserModel } from "../../data/mongo";
import { CustomError, RegisterUserDto, UpdateUserDto, UserDatasource, UserEntity } from "../../domain";
import { bcryptAdapter } from "../../config";

export class MongoUserDatasource implements UserDatasource {


  async insertUser(registerUserDto: RegisterUserDto): Promise<UserEntity> {

    const user = new UserModel(registerUserDto);


    // Encriptar la contraseña
    user.password = bcryptAdapter.hash(registerUserDto.password);

    await user.save();

    const { ...userEntity } = UserEntity.fromObject(user);

    return userEntity;
  }

  async updateUser(registerUserDto: RegisterUserDto): Promise<UserEntity> {
  
    const user = new UserModel();
    user.isNew = false; 
    user.set(registerUserDto);
    user.password = bcryptAdapter.hash(registerUserDto.password);
    
    await user.save();

    const { ...userEntity } = UserEntity.fromObject(user);

    return userEntity;
  }

  async getUserById(id: string): Promise<UserEntity> {
    const userWithRole = await UserModel.aggregate([
      {
        $match: { _id: new Types.ObjectId(id) }
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
    if (!userWithRole || userWithRole.length === 0) throw CustomError.badRequest('Usuario no existe');

    const user = userWithRole[0];
    return user;
  };


  async getUsers(): Promise<UserEntity[]> {
    const userWithRole = await UserModel.aggregate([
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

    const users = userWithRole.map(role => UserEntity.fromObject(role));
    return users;
  };


  async deleteUserById(id: string): Promise<boolean> {
    const user = await UserModel.deleteOne({ _id: id });
    return user.acknowledged;
  };


  async getUserForRegistration(registerUserDto: RegisterUserDto): Promise<UserEntity | null> {
    return await UserModel.findOne({
      $or: [
        { email: registerUserDto.email },
        { cedula: registerUserDto.cedula }
      ]
    });

  }

}