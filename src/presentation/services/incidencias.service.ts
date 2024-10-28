import { JwtAdapter, bcryptAdapter, envs } from '../../config';
import { CustomError, RegisterSubTipoIncidenciaDto, RegisterTipoIncidenciaDto, SubTipoIncidenciaRepository, TipoIncidenciaRepository } from '../../domain';
import { WssService } from './wss.services';



export class IncidenciaService {

  // DI
  constructor(
    private readonly tipoIncidenciaRepository: TipoIncidenciaRepository,
    private readonly subTipoIncidenciaRepository: SubTipoIncidenciaRepository,
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

      const tipoIncidenciaEntity = await this.tipoIncidenciaRepository.insertTipoIncidencia(registerTipoIncidenciaDto);


      const token = await JwtAdapter.generateToken({ id: tipoIncidenciaEntity.id });
      if (!token) throw CustomError.internalServer('Error while creating JWT');

      WssService.instance.sendMessage('newTipoIncidencia', '');

      return {
        user: tipoIncidenciaEntity,
        token: token
      };

    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }

  }

  public async updateTipoIncidencia(registerTipoIncidenciaDto: RegisterTipoIncidenciaDto) {
    try {

      const exist = await this.tipoIncidenciaRepository.getTipoIncidenciaForRegistration(registerTipoIncidenciaDto);

      if (exist) {
        if (exist.id !== registerTipoIncidenciaDto.id) {
          throw CustomError.badRequest('Incidencia ya existe');
        }
      }
      const tipoIncidenciaEntity = await this.tipoIncidenciaRepository.updateTipoIncidencia(registerTipoIncidenciaDto);
      WssService.instance.sendMessage('newTipoIncidencia', '');

      return tipoIncidenciaEntity;

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

  

  public async registerSubTipoIncidencia(registerSubTipoIncidenciaDto: RegisterSubTipoIncidenciaDto) {

    try {
      const exist = await this.subTipoIncidenciaRepository.getSubTipoIncidenciaForRegistration(registerSubTipoIncidenciaDto);

      if (exist) {
        if (exist.name.toLocaleLowerCase() === registerSubTipoIncidenciaDto.name.toLocaleLowerCase()) {
          throw CustomError.badRequest('Incidencia ya existe');
        }
      }

      const tipoIncidenciaEntity = await this.subTipoIncidenciaRepository.insertSubTipoIncidencia(registerSubTipoIncidenciaDto);


      const token = await JwtAdapter.generateToken({ id: tipoIncidenciaEntity.id });
      if (!token) throw CustomError.internalServer('Error while creating JWT');

      WssService.instance.sendMessage('newTipoIncidencia','');

      return {
        user: tipoIncidenciaEntity,
        token: token
      };

    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }

  }

  public async updateSubTipoIncidencia(registerSubTipoIncidenciaDto: RegisterSubTipoIncidenciaDto) {
    try {

      const exist = await this.subTipoIncidenciaRepository.getSubTipoIncidenciaForRegistration(registerSubTipoIncidenciaDto);

      if (exist) {
        if (exist.id !== registerSubTipoIncidenciaDto.id) {
          throw CustomError.badRequest('Incidencia ya existe');
        }
      }
      const tipoIncidenciaEntity = await this.subTipoIncidenciaRepository.updateSubTipoIncidencia(registerSubTipoIncidenciaDto);
      WssService.instance.sendMessage('newTipoIncidencia', '');

      return tipoIncidenciaEntity;

    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  public async getAllSubTipoIncidenciaByTipoIncidencia(idTipo: string, page: number, limit: number, searchQuery: string) {
    const tipos = await this.subTipoIncidenciaRepository.getAllSubTipoIncidenciaByTipoIncidencia(idTipo, page, limit, searchQuery);
    return tipos;
  }

  public async getSubTipoIncidenciaById(id: string) {
    const tipos = await this.subTipoIncidenciaRepository.getSubTipoIncidenciaById(id);
    return tipos;
  }

  public async deleteSubTipoIncidenciaById(id: string) {
    const tipos = await this.subTipoIncidenciaRepository.deleteSubTipoIncidenciaById(id);
    return tipos;
  }
}