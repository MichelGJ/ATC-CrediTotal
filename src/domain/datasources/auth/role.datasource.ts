import {RoleEntity} from "../..";

export abstract class RoleDatasource {
    abstract getRoles(): Promise<RoleEntity[]>;
}