import { Router } from 'express';
import { TicketRoutes } from './tickets/routes';
import { AuthRoutes } from './auth/routes';
import { IncidenciaRoute } from './incidencias/routes';




export class AppRoutes {


  static get routes(): Router {

    const router = Router();
    
    // Definir las rutas
    // router.use('/api/todos', /*TodoRoutes.routes */ );


    router.use('/api/ticket',  TicketRoutes.routes  );
    router.use('/api/auth', AuthRoutes.routes);
    router.use('/api/incidencia', IncidenciaRoute.routes);

    return router;
  }


}

