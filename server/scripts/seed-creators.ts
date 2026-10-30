import "dotenv/config";
import { upsertCreator } from "../modules/creators/creators.service.js";

const seeds = [
  {
    platform: "youtube" as const,
    externalId: "seed_yt_aura",
    handle: "aura.labs",
    displayName: "Aura Labs",
    followerCount: 240000,
    engagementRate: "3.80",
    niches: ["beauty", "skincare"],
    country: "IN",
    imageUrl: null,
  },
  {
    platform: "instagram" as const,
    externalId: "seed_ig_nova",
    handle: "novacreates",
    displayName: "Nova Creates",
    followerCount: 88000,
    engagementRate: "4.20",
    niches: ["lifestyle", "fashion"],
    country: "IN",
    imageUrl: null,
  },
  {
    platform: "youtube" as const,
    externalId: "seed_yt_pixel",
    handle: "pixelcraft",
    displayName: "Pixelcraft",
    followerCount: 510000,
    engagementRate: "2.40",
    niches: ["tech", "gadgets"],
    country: "US",
    imageUrl: null,
  },
];

async function main() {
  for (const seed of seeds) {
    const row = await upsertCreator(seed);
    console.warn(`seeded ${row.platform}:${row.handle}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
