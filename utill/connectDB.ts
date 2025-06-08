import mongoose from "mongoose";
import { Redis } from "ioredis";
const MONGODB_URI = process.env.MONGO_URI!; //! guaranted that value not be null
if (!MONGODB_URI) {
  throw new Error("Please define mongodb uri");
}

let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { connection: null, promise: null };
}
let options: {
  bufferCommands: boolean;
  maxPoolSize: number;
};
export const connectToDataBase = async () => {
  if (cached.connection) {
    return cached.connection;
  }
  if (!cached.promise) {
    options = {
      bufferCommands: false,
      maxPoolSize: 10,
    };
  }

  cached.promise = mongoose.connect(MONGODB_URI, options).then(() => {
    console.log("MongoDB connected successfully");
    return mongoose.connection;
  });

  try {
    cached.connection = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw error;
  }

  return cached.connection;
};
let redisClient: Redis;

if (!global.redis) {
  redisClient = new Redis();
  global.redis = redisClient;
  redisClient.on("connect", () => console.log("redis connected successfully"));
} else {
  redisClient = global.redis;
}
export const client = redisClient;
