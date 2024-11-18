import { Router } from 'express';
import { AtpController } from './controller';
import { AtpService } from '../services';
import { MongoTicketPresencialDatasource, TicketPresencialRepositoryImpl } from '../../infrastructure/';

const ticketPresencialRepository = new TicketPresencialRepositoryImpl(
    // new FileSystemDataSource()
    new MongoTicketPresencialDatasource()
);

export class AtpRoute {

    static get routes(): Router {

        const router = Router();

        const atpService = new AtpService(ticketPresencialRepository);

        const controller = new AtpController(atpService);

        // Tickets
        /**
         * @swagger
         * /registerTicketPresencial:
         *   post:
         *     summary: Register a new Ticket Presencial
         *     tags: [ATP]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             properties:
         *               name:
         *                 type: string
         *               description:
         *                 type: string
         *     responses:
         *       201:
         *         description: Ticket Presencial registered successfully
         */
        router.post('/registerTicketPresencial', controller.registerTicketPresencial);

        /**
         * @swagger
         * /updateTicketPresencial:
         *   put:
         *     summary: Update an existing Ticket Presencial
         *     tags: [ATP]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             properties:
         *               id:
         *                 type: string
         *               name:
         *                 type: string
         *               description:
         *                 type: string
         *     responses:
         *       200:
         *         description: Ticket Presencial updated successfully
         */
        router.put('/updateTicketPresencial', controller.updateTicketPresencial);

        /**
         * @swagger
         * /getAllTicketPresencial:
         *   get:
         *     summary: Get all Ticket Presencial
         *     tags: [ATP]
         *     responses:
         *       200:
         *         description: List of all Ticket Presencial
         */
        router.get('/getAllTicketPresencial/', controller.getAllTicketPresencial);

        /**
         * @swagger
         * /getTicketPresencialById/{id}:
         *   get:
         *     summary: Get Ticket Presencial by ID
         *     tags: [ATP]
         *     parameters:
         *       - in: path
         *         name: id
         *         schema:
         *           type: string
         *         required: true
         *         description: ID of the Ticket Presencial to get
         *     responses:
         *       200:
         *         description: Ticket Presencial details
         */
        router.get('/getTicketPresencialById/:id', controller.getTicketPresencialById);

        /**
         * @swagger
         * /deleteTicketPresencialById/{id}:
         *   delete:
         *     summary: Delete Ticket Presencial by ID
         *     tags: [ATP]
         *     parameters:
         *       - in: path
         *         name: id
         *         schema:
         *           type: string
         *         required: true
         *         description: ID of the Ticket Presencial to delete
         *     responses:
         *       200:
         *         description: Ticket Presencial deleted successfully
         */
        router.delete('/deleteTicketPresencialById/:id', controller.deleteTicketPresencialById);

        return router;
    }
}