import Fastify from 'fastify';
import { Pool } from 'pg';
import { PrismaClient } from '@prisma/client';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import env from './config/env.js';
import complianceRoutes from './routes/complianceRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize Fastify
const app = Fastify({ logger: true });

// Initialize PostgreSQL Pool
const pool = new Pool({
  user: env.DB_USER,
  host: env.DB_HOST,
  database: env.DB_NAME,
  password: env.DB_PASSWORD,
  port: env.DB_PORT,
});

// Initialize Prisma
const prisma = new PrismaClient();

// Register routes
app.register(complianceRoutes, { prefix: '/api' });

// Dependency injection
app.decorate('dbPool', pool);
app.decorate('prisma', prisma);

// Start server
const start = async () => {
  try {
    await app.listen({ port: env.PORT, host: '0.0.0.0' });
    console.log(`Server running on http://0.0.0.0:${env.PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();