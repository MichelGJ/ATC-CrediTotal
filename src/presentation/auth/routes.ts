import { Router } from 'express';
import { AuthController } from './controller';
import { AuthService, EmailService } from '../services';
import { envs } from '../../config';
import { RoleRepositoryImpl, MongoRoleDatasource, UserRepositoryImpl, MongoUserDatasource } from '../../infrastructure/';
import { ValidateMiddleware } from '../middlewares/validate.middleware';

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

    const authService = new AuthService(roleRepository, userRepository);

    const controller = new AuthController(authService);

    /**
     * @swagger
     * /login:
     *   post:
     *     summary: Login a user
     *     tags: [Auth]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               email:
     *                 type: string
     *               password:
     *                 type: string
     *     responses:
     *       200:
     *         description: User logged in successfully
     *       401:
     *         description: Unauthorized
     */
    router.post('/login', controller.loginUser);

    /**
     * @swagger
     * /register:
     *   post:
     *     summary: Register a new user
     *     tags: [Auth]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               email:
     *                 type: string
     *               password:
     *                 type: string
     *               role:
     *                 type: string
     *     responses:
     *       201:
     *         description: User registered successfully
     *       400:
     *         description: Bad request
     */
    router.post('/register', [ValidateMiddleware.validate], controller.registerUser);

    /**
     * @swagger
     * /updateUser:
     *   put:
     *     summary: Update an existing user
     *     tags: [Auth]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               id:
     *                 type: string
     *               email:
     *                 type: string
     *               role:
     *                 type: string
     *     responses:
     *       200:
     *         description: User updated successfully
     *       404:
     *         description: User not found
     */
    router.put('/updateUser', controller.updateUser);

    /**
     * @swagger
     * /getRoles:
     *   get:
     *     summary: Retrieve a list of roles
     *     tags: [Auth]
     *     responses:
     *       200:
     *         description: A list of roles
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 type: object
     *                 properties:
     *                   id:
     *                     type: string
     *                   name:
     *                     type: string
     */
    router.get('/getRoles', controller.getRoles);

    /**
     * @swagger
     * /getUsers:
     *   get:
     *     summary: Retrieve a list of users
     *     tags: [Auth]
     *     responses:
     *       200:
     *         description: A list of users
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 type: object
     *                 properties:
     *                   id:
     *                     type: string
     *                   email:
     *                     type: string
     *                   role:
     *                     type: string
     */
    router.get('/getUsers', controller.getUsers);

    /**
     * @swagger
     * /getUserById/{id}:
     *   get:
     *     summary: Retrieve a user by ID
     *     tags: [Auth]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: A user object
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 id:
     *                   type: string
     *                 email:
     *                   type: string
     *                 role:
     *                   type: string
     *       404:
     *         description: User not found
     */
    router.get('/getUserById/:id', controller.getUserById);

    /**
     * @swagger
     * /deleteUserById/{id}:
     *   delete:
     *     summary: Delete a user by ID
     *     tags: [Auth]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: User deleted successfully
     *       404:
     *         description: User not found
     */
    router.delete('/deleteUserById/:id', controller.deleteUserById);

    return router;
  }
}