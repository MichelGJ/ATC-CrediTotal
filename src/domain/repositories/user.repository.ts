import { LoginUserDto, RegisterUserDto, UpdateUserDto, UserEntity } from "../";

export abstract class UserRepository {
    abstract insertUser(registerUserDto: RegisterUserDto): Promise<UserEntity>;
    abstract updateUser(registerUserDto: RegisterUserDto): Promise<UserEntity>;
    abstract getUserById(id: string): Promise<UserEntity>;
    abstract getUsers(): Promise<UserEntity[]>;
    abstract deleteUserById(id: string): Promise<boolean>;
    abstract getUserForRegistration(registerUserDto: RegisterUserDto): Promise<UserEntity | null>;
    abstract getUserForLogin(loginUserDto: LoginUserDto): Promise<UserEntity>;
}