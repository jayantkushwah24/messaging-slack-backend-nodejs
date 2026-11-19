import mongoose from "mongoose";

import { DEV_DB_URL, NODE_ENV, PROD_DB_URL } from "./serverConfig.js";

async function connectDB() {
  const dbUrl =
    NODE_ENV === "development"
      ? DEV_DB_URL
      : NODE_ENV === "production"
        ? PROD_DB_URL
        : undefined;
  if (!dbUrl) {
    throw new Error(`Missing database URL for ${NODE_ENV} environment`);
  }

  await mongoose.connect(dbUrl);
  console.log(`connected to mongodb from ${NODE_ENV} environment`);
}

export default connectDB;
