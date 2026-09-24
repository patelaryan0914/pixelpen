import "dotenv/config";
import { backfillCovers } from "../src/lib/publish-tech-posts";

backfillCovers()
  .then((result) => {
    console.log(JSON.stringify(result));
  })
  .catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  });
