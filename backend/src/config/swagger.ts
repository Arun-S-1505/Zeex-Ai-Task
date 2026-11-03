import swaggerJSDoc from 'swagger-jsdoc';
import { env } from './env.js';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'SentinelAI Visual Safety Surveillance Platform API',
    version: '1.0.0',
    description:
      'Production-oriented backend API powering SentinelAI: Enterprise AI-Powered Visual Safety Surveillance for industrial plants, factories, and construction sites.',
    contact: {
      name: 'SentinelAI Engineering',
      email: 'engineering@sentinel.ai',
    },
  },
  servers: [
    {
      url: `http://localhost:${env.PORT}/api/v1`,
      description: 'Local Development Server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Provide JWT token: Bearer <token>',
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./src/modules/**/*.ts', './src/app.ts'],
};

export const swaggerSpec = swaggerJSDoc(options);
export default swaggerSpec;
