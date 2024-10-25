import { Router } from 'express';
import { IncidenciasController } from './controller';
import { AuthService, EmailService, IncidenciaService } from '../services';
import { envs } from '../../config';
import { TipoIncidenciaRepositoryImpl, MongoTipoIncidenciaDatasource } from '../../infrastructure/';

const tipoIncidenciaRepository = new TipoIncidenciaRepositoryImpl(
    // new FileSystemDataSource()
    new MongoTipoIncidenciaDatasource()
);

export class IncidenciaRoute {


    static get routes(): Router {

        const router = Router();

        const incidenciaService = new IncidenciaService(tipoIncidenciaRepository);

        const controller = new IncidenciasController(incidenciaService);


        // Definir las rutas
        router.post('/registerTipoIncidencia', controller.registerTipoIncidencia);
        router.put('/updateTipoIncidencia', controller.updateTipoIncidencia);
        router.get('/getAllTipoIncidencia', controller.getAllTipoIncidencia);
        router.get('/getTipoIncidenciaById/:id', controller.getTipoIncidenciaById);
        router.delete('/deleteTipoIncidenciaById/:id', controller.deleteTipoIncidenciaById);


        return router;
    }


}

