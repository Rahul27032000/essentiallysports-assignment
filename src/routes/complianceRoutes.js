import ComplianceController from '../controllers/complianceController.js';

export default async function (fastify, opts) {
  const controller = new ComplianceController(fastify);

  fastify.post('/publish', {
    schema: {
      body: {
        type: 'object',
        required: ['article', 'feed'],
        properties: {
          article: { type: 'object' },
          feed: { type: 'string' },
        },
      },
    },
  }, controller.publish.bind(controller));

  fastify.get('/health', controller.health.bind(controller));
}