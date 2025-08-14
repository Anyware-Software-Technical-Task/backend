import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

beforeAll(async () => {
  // Connect to test database
  const testMongoUri = process.env.MONGO_URI_TEST || process.env.MONGO_URI;
  await mongoose.connect(testMongoUri as string);

  // Clean database before all tests
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

afterAll(async () => {
  // Close database connection
  await mongoose.connection.close();
});

afterEach(async () => {
  // Clean up database after each test
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});
