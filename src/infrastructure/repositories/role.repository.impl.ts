import { RoleDatasource, RoleEntity, RoleRepository } from "../../domain/";

export class RoleRepositoryImpl implements RoleRepository {

    constructor(
        private readonly roleDatasource: RoleDatasource
    ) { }

    async getRoles(): Promise<RoleEntity[]> {
        return this.roleDatasource.getRoles();
    }

}