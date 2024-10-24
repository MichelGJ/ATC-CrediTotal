import { LoginUserDto, RegisterUserDto, UpdateUserDto, UserDatasource, UserEntity, UserRepository } from "../../../domain";

export class UserRepositoryImpl implements UserRepository {

    constructor(
        private readonly userDatasource: UserDatasource
    ) { }

    insertUser(registerUserDto: RegisterUserDto): Promise<UserEntity> {
        return this.userDatasource.insertUser(registerUserDto);
    }

    updateUser(UpdateUserDto: UpdateUserDto): Promise<UserEntity> {
        return this.userDatasource.updateUser(UpdateUserDto);
    }

    getUserById(id: string): Promise<UserEntity> {
        return this.userDatasource.getUserById(id)
    }

    getUsers(page: number, limit: number,searchQuery: string):Promise<{ users: UserEntity[], currentPage: number, totalPages: number }> {
        return this.userDatasource.getUsers(page, limit, searchQuery);
    }

    deleteUserById(id: string): Promise<boolean> {
        return this.userDatasource.deleteUserById(id);
    }

    getUserForRegistration(registerUserDto: RegisterUserDto): Promise<UserEntity | null> {
        return this.userDatasource.getUserForRegistration(registerUserDto);
    }

    getUserForLogin(loginUserDto: LoginUserDto): Promise<UserEntity> {
        return this.userDatasource.getUserForLogin(loginUserDto);
    }

}