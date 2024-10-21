import { Router } from 'express';
import { AuthController } from './controller';
import { AuthService, EmailService } from '../services';
import { envs } from '../../config';
import { RoleRepositoryImpl, MongoRoleDatasource } from '../../infrastructure/';

const roleRepository = new RoleRepositoryImpl(
  // new FileSystemDataSource()
  new MongoRoleDatasource()
);

export class AuthRoutes {


  static get routes(): Router {

    const router = Router();

    const emailService = new EmailService(
      envs.MAILER_SERVICE,
      envs.MAILER_EMAIL,
      envs.MAILER_SECRET_KEY,
      envs.SEND_EMAIL
    );
    
    const authService = new AuthService(roleRepository, emailService);

    const controller = new AuthController(authService);


    // Definir las rutas
    router.post('/login', controller.loginUser);
    router.post('/register', controller.registerUser);
    router.get('/getRoles', controller.getRoles);

    // router.get('/validate-email/:token', controller.validateEmail);


    return router;
  }


}

