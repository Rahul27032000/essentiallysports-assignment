import { executeQuery } from "./src2/utils/executeQuery.js";

const partners = [
  {
    name: "Microsoft MSN",
    code: "MSN",
    description: "Syndication feed for MSN",
    config: {
      username: "msn_feed_user",
      password: "secret123",
    },
    validationConfig: {
      bodyLength: { min: 200, max: 5000 },
      titleLength: { min: 10, max: 100 },
      prohibitedWords: ["gambling", "violence", "drugs"],
      requiredFields: ["title", "thumbnail", "author", "category"],
    },
  },
  {
    name: "Google News",
    code: "GOOGLE",
    description: "Syndication feed for Google News",
    config: {
      token: "google-news-api-token",
    },
    validationConfig: {
      bodyLength: { min: 100, max: 10000 },
      titleLength: { min: 5, max: 120 },
      prohibitedWords: ["fake", "clickbait"],
      requiredFields: ["title", "author", "category"],
    },
  },
];

async function seed() {
  try {
    for (const partner of partners) {
      await executeQuery({
        text: `
          INSERT INTO "Partner" (name, code, description, config, "validationConfig")
          VALUES ($1, $2, $3, $4, $5)
          ON CONFLICT (code) DO NOTHING;
        `,
        values: [
          partner.name,
          partner.code,
          partner.description,
          partner.config,
          partner.validationConfig,
        ],
      });
      console.log(`✅ Seeded partner: ${partner.code}`);
    }
    console.log("🌱 Partner seeding completed!");
  } catch (err) {
    console.error("❌ Error seeding partners:", err);
  }
}

seed().then(() => process.exit(0));
