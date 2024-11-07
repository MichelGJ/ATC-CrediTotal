import { Router } from 'express';
import { AtpController } from './controller';
import { AtpService } from '../services';
import { MongoTicketPresencialDatasource, TicketPresencialRepositoryImpl} from '../../infrastructure/';

const ticketPresencialRepository = new TicketPresencialRepositoryImpl(
    // new FileSystemDataSource()
    new MongoTicketPresencialDatasource()
);


export class IncidenciaRoute {


    static get routes(): Router {

        const router = Router();

        const atpService = new AtpService(ticketPresencialRepository);

        const controller = new AtpController(atpService);


        //Tickets
        router.post('/registerTicketPresencial', controller.registerTicketPresencial);
        router.put('/updateTicketPresencial', controller.updateTicketPresencial);
        router.get('/getAllTicketPresencial/', controller.getAllTicketPresencial);
        router.get('/getTicketPresencialById/:id', controller.getTicketPresencialById);
        router.delete('/deleteTicketPresencialById/:id', controller.deleteTicketPresencialById);


        return router;
    }


}

