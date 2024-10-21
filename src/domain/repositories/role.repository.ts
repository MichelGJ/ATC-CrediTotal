import { RoleEntity } from "../entities/role.entity";

export abstract class RoleRepository {
    abstract getRoles(): Promise<RoleEntity[]>;
}