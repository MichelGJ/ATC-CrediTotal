import { Router } from 'express';
import { IncidenciasController } from './controller';
import { AuthService, EmailService, IncidenciaService } from '../services';
import { envs } from '../../config';
import { TipoIncidenciaRepositoryImpl, MongoTipoIncidenciaDatasource, SubTipoIncidenciaRepositoryImpl, MongoSubTipoIncidenciaDatasource } from '../../infrastructure/';

const tipoIncidenciaRepository = new TipoIncidenciaRepositoryImpl(
    // new FileSystemDataSource()
    new MongoTipoIncidenciaDatasource()
);

const subTipoIncidenciaRepository = new SubTipoIncidenciaRepositoryImpl(
    // new FileSystemDataSource()
    new MongoSubTipoIncidenciaDatasource()
);

export class IncidenciaRoute {


    static get routes(): Router {

        const router = Router();

        const incidenciaService = new IncidenciaService(tipoIncidenciaRepository, subTipoIncidenciaRepository);

        const controller = new IncidenciasController(incidenciaService);


        // Tipos
        router.post('/registerTipoIncidencia', controller.registerTipoIncidencia);
        router.put('/updateTipoIncidencia', controller.updateTipoIncidencia);
        router.get('/getAllTipoIncidencia', controller.getAllTipoIncidencia);
        router.get('/getTipoIncidenciaById/:id', controller.getTipoIncidenciaById);
        router.delete('/deleteTipoIncidenciaById/:id', controller.deleteTipoIncidenciaById);
        //SubTipos
        router.post('/registerSubTipoIncidencia', controller.registerSubTipoIncidencia);
        router.put('/updateSubTipoIncidencia', controller.updateSubTipoIncidencia);
        router.get('/getAllSubTipoIncidenciaByTipoIncidencia/', controller.getAllSubTipoIncidenciaByTipoIncidencia);
        router.get('/getSubTipoIncidenciaById/:id', controller.getSubTipoIncidenciaById);
        router.delete('/deleteSubTipoIncidenciaById/:id', controller.deleteSubTipoIncidenciaById);
        


        return router;
    }


}

