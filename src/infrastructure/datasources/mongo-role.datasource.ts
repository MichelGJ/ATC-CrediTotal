import { RoleModel } from "../../data/mongo";
import { RoleDatasource } from "../../domain/";
import { RoleEntity } from "../../domain/";

export class MongoRoleDatasource implements RoleDatasource {


    async getRoles(): Promise<RoleEntity[]> {
        const roles = await RoleModel.find();
        return roles.map(role => RoleEntity.fromObject(role));
    };


}