import { readFile, readdir } from 'fs/promises';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { FEEDS, CHECK_TYPES, OUTCOMES } from '../config/constants.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default class ComplianceService {
  constructor(prisma) {
    this.prisma = prisma;
    this.checks = {};
    this.loadConfigs();
  }

  async loadConfigs() {
    const feedDir = join(__dirname, '../config/feeds');
    const files = await readdir(feedDir);
    for (const file of files) {
      const config = JSON.parse(await readFile(join(feedDir, file)));
      this.checks[config.feed] = config.checks;
    }
  }

  async validateArticle(article, feed) {
    if (!this.checks[feed]) {
      throw new Error(`Unknown feed: ${feed}`);
    }

    const results = [];
    for (const check of this.checks[feed]) {
      switch (check.type) {
        case CHECK_TYPES.BODY_LENGTH:
          results.push(this.checkBodyLength(article, check));
          break;
        case CHECK_TYPES.PROHIBITED_KEYWORDS:
          results.push(this.checkProhibitedKeywords(article, check));
          break;
        case CHECK_TYPES.METADATA:
          results.push(this.checkMetadata(article, check));
          break;
        default:
          results.push({ success: false, message: `Unknown check: ${check.type}` });
      }
    }

    const allPass = results.every(r => r.success);
    await this.logAudit(article.id, feed, results, allPass ? OUTCOMES.SUCCESS : OUTCOMES.FAILURE);
    return { success: allPass, results };
  }

  checkBodyLength(article, { min, max }) {
    const wordCount = (article.body || '').split(/\s+/).filter(w => w).length;
    if (wordCount < min || wordCount > max) {
      return { success: false, message: `Body length ${wordCount} out of range [${min}-${max}]` };
    }
    return { success: true, message: 'OK' };
  }

  checkProhibitedKeywords(article, { keywords }) {
    const text = `${article.title} ${article.body}`.toLowerCase();
    const found = keywords.find(k => text.includes(k.toLowerCase()));
    if (found) {
      return { success: false, message: `Prohibited keyword found: ${found}` };
    }
    return { success: true, message: 'OK' };
  }

  checkMetadata(article, { required_fields, max_title_length }) {
    for (const field of required_fields) {
      if (!article[field] || article[field] === '') {
        return { success: false, message: `Missing or empty field: ${field}` };
      }
    }
    if (article.title.length > max_title_length) {
      return { success: false, message: `Title too long: ${article.title.length} > ${max_title_length}` };
    }
    if (!/^https?:\/\//.test(article.thumbnail)) {
      return { success: false, message: 'Invalid thumbnail URL' };
    }
    return { success: true, message: 'OK' };
  }

  async logAudit(articleId, feed, results, outcome) {
    await this.prisma.auditLog.create({
      data: {
        articleId,
        feed,
        results,
        outcome,
      },
    });
  }

  async publishToFeed(article, feed) {
    console.log(`Publishing to ${feed}:`, article);
    return true;
  }
}