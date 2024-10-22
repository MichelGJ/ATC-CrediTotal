import { UserEntity } from "../";

export abstract class UserDatasource {
    abstract getUsers(): Promise<UserEntity[]>;
    abstract deleteUserById(id: string): Promise<boolean>;
}