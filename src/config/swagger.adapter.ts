import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';
import path from 'path';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'ATC-CREDITOTAL-API',
            version: '1.0.0',
        },
        tags: [
            {
                name: 'Auth',
                description: 'Authentication related endpoints',
            },
            {
                name: 'Incidencias',
                description: 'Incidencias related endpoints',
            },
            {
                name: 'ATP',
                description: 'Incidencias related endpoints',
            },
        ],
    },
    apis: [path.join(process.cwd(), 'src/presentation/auth/*.ts'), path.join(process.cwd(), 'src/presentation/incidencias/*.ts'), path.join(process.cwd(), 'src/presentation/atp/*.ts')]
};

const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app: Express): void => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};