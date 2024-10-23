import { Router } from 'express';
import { AuthController } from './controller';
import { AuthService, EmailService } from '../services';
import { envs } from '../../config';
import { RoleRepositoryImpl, MongoRoleDatasource, UserRepositoryImpl, MongoUserDatasource } from '../../infrastructure/';

const roleRepository = new RoleRepositoryImpl(
  // new FileSystemDataSource()
  new MongoRoleDatasource()
);

const userRepository = new UserRepositoryImpl(
  // new FileSystemDataSource()
  new MongoUserDatasource()
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

    const authService = new AuthService(roleRepository, userRepository, emailService);

    const controller = new AuthController(authService);


    // Definir las rutas
    router.post('/login', controller.loginUser);
    router.post('/register', controller.registerUser);
    router.put('/updateUser', controller.updateUser);
    router.get('/getRoles', controller.getRoles);
    router.get('/getUsers', controller.getUsers);
    router.get('/getUserById/:id', controller.getUserById);
    router.delete('/deleteUserById/:id', controller.deleteUserById);

    // router.get('/validate-email/:token', controller.validateEmail);


    return router;
  }


}

