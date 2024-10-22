import { UserDatasource, UserEntity, UserRepository } from "../../domain/";

export class UserRepositoryImpl implements UserRepository {

    constructor(
        private readonly userDatasource: UserDatasource
    ) { }

    async getUsers(): Promise<UserEntity[]> {
        return this.userDatasource.getUsers();
    }

    async deleteUserById(id: string): Promise<boolean> {
        return this.userDatasource.deleteUserById(id);
    }
}