import ComplianceService from '../services/complianceService.js';

export default class ComplianceController {
  constructor(fastify) {
    this.service = new ComplianceService(fastify.prisma);
  }

  async publish(request, reply) {
    const { article, feed } = request.body;
    try {
      const { success, results } = await this.service.validateArticle(article, feed);
      if (success) {
        await this.service.publishToFeed(article, feed);
        return reply.code(200).send({ status: 'success', message: 'Article published' });
      } else {
        return reply.code(400).send({ status: 'failure', results });
      }
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ status: 'error', message: error.message });
    }
  }

  async health(request, reply) {
    try {
      await request.dbPool.query('SELECT 1');
      if (Object.keys(this.service.checks).length === 0) {
        throw new Error('No feed configs loaded');
      }
      return reply.code(200).send({ status: 'healthy' });
    } catch (error) {
      return reply.code(500).send({ status: 'unhealthy', message: error.message });
    }
  }
}