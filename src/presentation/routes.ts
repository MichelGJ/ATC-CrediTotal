import { Router } from 'express';
import { TicketRoutes } from './tickets/routes';
import { AuthRoutes } from './auth/routes';
import { IncidenciaRoute } from './incidencias/routes';
import { envs } from '../config/envs';
import { AtpRoute } from './atp/route';




export class AppRoutes {


  static get routes(): Router {

    const router = Router();
    
    // Definir las rutas
    // router.use('/api/todos', /*TodoRoutes.routes */ );


    router.use('/api/ticket',  TicketRoutes.routes  );
    router.use('/api/auth', AuthRoutes.routes);
    router.use('/api/incidencia', IncidenciaRoute.routes);
    router.use('/api/atp', AtpRoute.routes);
    router.get('/api/envs', (req, res) => {
      res.json(envs); // Send envs as JSON response
    });

    return router;
  }


}

