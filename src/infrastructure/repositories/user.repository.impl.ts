import { LoginUserDto, RegisterUserDto, UpdateUserDto, UserDatasource, UserEntity, UserRepository } from "../../domain/";

export class UserRepositoryImpl implements UserRepository {

    constructor(
        private readonly userDatasource: UserDatasource
    ) { }

    insertUser(registerUserDto: RegisterUserDto): Promise<UserEntity> {
        return this.userDatasource.insertUser(registerUserDto);
    }

    updateUser(registerUserDto: RegisterUserDto): Promise<UserEntity> {
        return this.userDatasource.updateUser(registerUserDto);
    }

    getUserById(id: string): Promise<UserEntity> {
        return this.userDatasource.getUserById(id)
    }

    getUsers(): Promise<UserEntity[]> {
        return this.userDatasource.getUsers();
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