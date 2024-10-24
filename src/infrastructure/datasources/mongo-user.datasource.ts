import { Types } from "mongoose";
import { UserModel } from "../../data/mongo";
import { CustomError, LoginUserDto, RegisterUserDto, UpdateUserDto, UserDatasource, UserEntity } from "../../domain";
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


  async getUsers(page: number, limit: number, searchQuery: string = ''): Promise<{ users: UserEntity[], currentPage: number, totalPages: number }> {
    const skip = (page - 1) * limit;

    const searchCondition = searchQuery
      ? {
        $or: [
          { name: { $regex: searchQuery, $options: 'i' } },   // Case-insensitive search
          { email: { $regex: searchQuery, $options: 'i' } },
          { cedula: { $regex: searchQuery, $options: 'i' } }
        ]
      }
      : {};

    const totalUsers = await UserModel.countDocuments(searchCondition);

    const totalPages = Math.ceil(totalUsers / limit);

    const userWithRole = await UserModel.aggregate([
      { $match: searchCondition },
      {
        $lookup: {
          from: 'roles',
          localField: 'role',
          foreignField: '_id',
          as: 'roleDetails'
        }
      },
      { $unwind: '$roleDetails' },
      { $skip: skip },       // Skip records for pagination
      { $limit: limit }      // Limit the number of records returned
    ]);

    const users = userWithRole.map(role => UserEntity.fromObject(role));
    return {
      users,
      currentPage: page,
      totalPages
    };
  }



  async deleteUserById(id: string): Promise<boolean> {
    const user = await UserModel.deleteOne({ _id: id });
    return user.acknowledged;
  };


  async getUserForRegistration(registerUserDto: RegisterUserDto): Promise<UserEntity | null> {
    return await UserModel.findOne({
      $or: [
        { email: { $regex: new RegExp(registerUserDto.email, 'i') } },
        { cedula: registerUserDto.cedula }
      ]
    });
  }

  async getUserForLogin(loginUserDto: LoginUserDto): Promise<UserEntity> {
    const userWithRole = await UserModel.aggregate([
      {
        $match: { email: { $regex: new RegExp(loginUserDto.email, 'i') } }
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
    return user;
  };
}