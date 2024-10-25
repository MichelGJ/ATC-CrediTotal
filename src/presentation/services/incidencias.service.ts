import { JwtAdapter, bcryptAdapter, envs } from '../../config';
import { CustomError, RegisterTipoIncidenciaDto, SubTipoIncidenciaRepository, TipoIncidenciaRepository } from '../../domain';
import { WssService } from './wss.services';



export class IncidenciaService {

  // DI
  constructor(
    private readonly tipoIncidenciaRepository: TipoIncidenciaRepository,
    // private readonly subTipoIncidenciaRepository: SubTipoIncidenciaRepository,
    // webServiceUrl: string,
  ) { }


  public async registerTipoIncidencia(registerTipoIncidenciaDto: RegisterTipoIncidenciaDto) {

    try {
      const exist = await this.tipoIncidenciaRepository.getTipoIncidenciaForRegistration(registerTipoIncidenciaDto);

      if (exist) {
        if (exist.name.toLocaleLowerCase() === registerTipoIncidenciaDto.name.toLocaleLowerCase()) {
          throw CustomError.badRequest('Incidencia ya existe');
        }
      }

      const userEntity = await this.tipoIncidenciaRepository.insertTipoIncidencia(registerTipoIncidenciaDto);


      const token = await JwtAdapter.generateToken({ id: userEntity.id });
      if (!token) throw CustomError.internalServer('Error while creating JWT');

      WssService.instance.sendMessage('newUser', userEntity);

      return {
        user: userEntity,
        token: token
      };

    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }

  }

  public async updateTipoIncidencia(registerTipoIncidenciaDto: RegisterTipoIncidenciaDto) {
    try {

      const existUser = await this.tipoIncidenciaRepository.getTipoIncidenciaForRegistration(registerTipoIncidenciaDto);

      if (existUser) {
        if (existUser.id !== registerTipoIncidenciaDto.id) {
          throw CustomError.badRequest('Incidencia ya existe');
        } else {

          const tipoIncidenciaEntity = await this.tipoIncidenciaRepository.updateTipoIncidencia(registerTipoIncidenciaDto);
          WssService.instance.sendMessage('newTipoIncidencia', tipoIncidenciaEntity);

          return tipoIncidenciaEntity;
        }
      }
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }



  public async getAllTipoIncidencia(page: number, limit: number, searchQuery: string) {
    const tipos = await this.tipoIncidenciaRepository.getAllTipoIncidencia(page, limit, searchQuery);
    return tipos;
  }

  public async getTipoIncidenciaById(id: string) {
    const tipos = await this.tipoIncidenciaRepository.getTipoIncidenciaById(id);
    return tipos;
  }

  public async deleteTipoIncidenciaById(id: string) {
    const tipos = await this.tipoIncidenciaRepository.deleteTipoIncidenciaById(id);
    return tipos;
  }

}