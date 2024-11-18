import { Router } from 'express';
import { IncidenciasController } from './controller';
import { IncidenciaService } from '../services';
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
        /**
         * @swagger
         * /registerTipoIncidencia:
         *   post:
         *     summary: Register a new Tipo Incidencia
         *     tags: [Incidencias]
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
         *         description: Tipo Incidencia registered successfully
         */
        router.post('/registerTipoIncidencia', controller.registerTipoIncidencia);

        /**
         * @swagger
         * /updateTipoIncidencia:
         *   put:
         *     summary: Update an existing Tipo Incidencia
         *     tags: [Incidencias]
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
         *         description: Tipo Incidencia updated successfully
         */
        router.put('/updateTipoIncidencia', controller.updateTipoIncidencia);

        /**
         * @swagger
         * /getAllTipoIncidencia:
         *   get:
         *     summary: Get all Tipo Incidencia
         *     tags: [Incidencias]
         *     responses:
         *       200:
         *         description: A list of Tipo Incidencia
         */
        router.get('/getAllTipoIncidencia', controller.getAllTipoIncidencia);

        /**
         * @swagger
         * /getTipoIncidenciaById/{id}:
         *   get:
         *     summary: Get Tipo Incidencia by ID
         *     tags: [Incidencias]
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: string
         *     responses:
         *       200:
         *         description: Tipo Incidencia details
         *       404:
         *         description: Tipo Incidencia not found
         */
        router.get('/getTipoIncidenciaById/:id', controller.getTipoIncidenciaById);

        /**
         * @swagger
         * /deleteTipoIncidenciaById/{id}:
         *   delete:
         *     summary: Delete Tipo Incidencia by ID
         *     tags: [Incidencias]
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: string
         *     responses:
         *       200:
         *         description: Tipo Incidencia deleted successfully
         *       404:
         *         description: Tipo Incidencia not found
         */
        router.delete('/deleteTipoIncidenciaById/:id', controller.deleteTipoIncidenciaById);

        //SubTipos

        /**
         * @swagger
         * /registerSubTipoIncidencia:
         *   post:
         *     summary: Register a new Sub Tipo Incidencia
         *     tags: [Incidencias]
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
         *               tipoIncidenciaId:
         *                 type: string
         *     responses:
         *       201:
         *         description: Sub Tipo Incidencia updated successfully
         */
        router.post('/registerSubTipoIncidencia', controller.registerSubTipoIncidencia);

        /**
         * @swagger
         * /updateSubTipoIncidencia:
         *   put:
         *     summary: Update an existing Sub Tipo Incidencia
         *     tags: [Incidencias]
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
         *               tipoIncidenciaId:
         *                 type: string
         *     responses:
         *       200:
         *         description: Sub Tipo Incidencia updated successfully
         */
        router.put('/updateSubTipoIncidencia', controller.updateSubTipoIncidencia);

        /**
         * @swagger
         * /getAllSubTipoIncidenciaByTipoIncidencia:
         *   get:
         *     summary: Get all Sub Tipo Incidencia by Tipo Incidencia
         *     tags: [Incidencias]
         *     responses:
         *       200:
         *         description: A list of Sub Tipo Incidencia
         */
        router.get('/getAllSubTipoIncidenciaByTipoIncidencia', controller.getAllSubTipoIncidenciaByTipoIncidencia);

        /**
         * @swagger
         * /getSubTipoIncidenciaById/{id}:
         *   get:
         *     summary: Get Sub Tipo Incidencia by ID
         *     tags: [Incidencias]
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: string
         *     responses:
         *       200:
         *         description: Sub Tipo Incidencia details
         *       404:
         *         description: Sub Tipo Incidencia not found
         */
        router.get('/getSubTipoIncidenciaById/:id', controller.getSubTipoIncidenciaById);

        /**
         * @swagger
         * /deleteSubTipoIncidenciaById/{id}:
         *   delete:
         *     summary: Delete Sub Tipo Incidencia by ID
         *     tags: [Incidencias]
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: string
         *     responses:
         *       200:
         *         description: Sub Tipo Incidencia deleted successfully
         *       404:
         *         description: Sub Tipo Incidencia not found
         */
        router.delete('/deleteSubTipoIncidenciaById/:id', controller.deleteSubTipoIncidenciaById);

        /**
         * @swagger
         * /deleteSubTipoIncidenciaByTipoIncidencia/{id}:
         *   delete:
         *     summary: Delete Sub Tipo Incidencia by Tipo Incidencia ID
         *     tags: [Incidencias]
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: string
         *     responses:
         *       200:
         *         description: Sub Tipo Incidencia deleted successfully
         *       404:
         *         description: Sub Tipo Incidencia not found
         */
        router.delete('/deleteSubTipoIncidenciaByTipoIncidencia/:id', controller.deleteSubTipoIncidenciaByTipoIncidencia);

        //Tickets
        /**
         * @swagger
         * /registerTicketSoporte:
         *   post:
         *     summary: Register a new Ticket Soporte
         *     tags: [Incidencias]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             properties:
         *               title:
         *                 type: string
         *               description:
         *                 type: string
         *               priority:
         *                 type: string
         *     responses:
         *       201:
         *         description: Ticket Soporte registered successfully
         */
        router.post('/registerTicketSoporte', controller.registerTicketSoporte);

        /**
         * @swagger
         * /updateTicketSoporte:
         *   put:
         *     summary: Update an existing Ticket Soporte
         *     tags: [Incidencias]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             properties:
         *               id:
         *                 type: string
         *               title:
         *                 type: string
         *               description:
         *                 type: string
         *               priority:
         *                 type: string
         *     responses:
         *       200:
         *         description: Ticket Soporte updated successfully
         */
        router.put('/updateTicketSoporte', controller.updateTicketSoporte);

        /**
         * @swagger
         * /closeTicketSoporte/{id}:
         *   put:
         *     summary: Close a Ticket Soporte by ID
         *     tags: [Incidencias]
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: string
         *     responses:
         *       200:
         *         description: Ticket Soporte closed successfully
         *       404:
         *         description: Ticket Soporte not found
         */
        router.put('/closeTicketSoporte/:id', controller.closeTicketSoporte);

        /**
         * @swagger
         * /getAllTicketSoporte:
         *   get:
         *     summary: Get all Ticket Soporte
         *     tags: [Incidencias]
         *     responses:
         *       200:
         *         description: A list of Ticket Soporte
         */
        router.get('/getAllTicketSoporte', controller.getAllTicketSoporte);

        /**
         * @swagger
         * /getTicketSoporteById/{id}:
         *   get:
         *     summary: Get Ticket Soporte by ID
         *     tags: [Incidencias]
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: string
         *     responses:
         *       200:
         *         description: Ticket Soporte details
         *       404:
         *         description: Ticket Soporte not found
         */
        router.get('/getTicketSoporteById/:id', controller.getTicketSoporteById);

        /**
         * @swagger
         * /deleteTicketSoporteById/{id}:
         *   delete:
         *     summary: Delete Ticket Soporte by ID
         *     tags: [Incidencias]
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: string
         *     responses:
         *       200:
         *         description: Ticket Soporte deleted successfully
         *       404:
         *         description: Ticket Soporte not found
         */
        router.delete('/deleteTicketSoporteById/:id', controller.deleteTicketSoporteById);


        return router;
    }


}

