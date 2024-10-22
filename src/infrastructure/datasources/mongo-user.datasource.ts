import { UserModel } from "../../data/mongo";
import { UserDatasource, UserEntity } from "../../domain";

export class MongoUserDatasource implements UserDatasource {


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

}