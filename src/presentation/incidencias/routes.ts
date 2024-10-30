import { Router } from 'express';
import { IncidenciasController } from './controller';
import { AuthService, EmailService, IncidenciaService } from '../services';
import {
    TipoIncidenciaRepositoryImpl, MongoTipoIncidenciaDatasource, SubTipoIncidenciaRepositoryImpl,
    MongoSubTipoIncidenciaDatasource, TicketSoporteRepositoryImpl, MongoTicketSoporteDatasource
} from '../../infrastructure/';

const tipoIncidenciaRepository = new TipoIncidenciaRepositoryImpl(
    // new FileSystemDataSource()
    new MongoTipoIncidenciaDatasource()
);

const subTipoIncidenciaRepository = new SubTipoIncidenciaRepositoryImpl(
    // new FileSystemDataSource()
    new MongoSubTipoIncidenciaDatasource()
);

const ticketSoporteRepository = new TicketSoporteRepositoryImpl(
    // new FileSystemDataSource()
    new MongoTicketSoporteDatasource()
);

export class IncidenciaRoute {


    static get routes(): Router {

        const router = Router();

        const incidenciaService = new IncidenciaService(tipoIncidenciaRepository, subTipoIncidenciaRepository, ticketSoporteRepository);

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
        //Tickets
        router.post('/registerTicketSoporte', controller.registerTicketSoporte);
        router.put('/updateTicketSoporte', controller.updateTicketSoporte);
        router.get('/getAllTicketSoporte/', controller.getAllTicketSoporte);
        router.get('/getTicketSoporteById/:id', controller.getTicketSoporteById);
        router.delete('/deleteTicketSoporteById/:id', controller.deleteTicketSoporteById);


        return router;
    }


}

