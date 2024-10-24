import { RoleEntity } from "../..";

export abstract class RoleRepository {
    abstract getRoles(): Promise<RoleEntity[]>;
}