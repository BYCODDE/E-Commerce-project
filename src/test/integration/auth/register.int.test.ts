import request from "supertest";
import app from "@/server";
import { clearTestUser } from "@/test/utils/testUtils";

const TEST_EMAIL = `integration-${Date.now()}@example.com`;

beforeAll(async () => {
  await clearTestUser(TEST_EMAIL);
});

afterAll(async () => {
  await clearTestUser(TEST_EMAIL);
});

test("POST /api/auth/register", async () => {
  const response = await request(app).post("/api/auth/register").send({
    name: "John Doe",
    email: TEST_EMAIL,
    age: 20,
    phone: "+1234567890",
    password: "password",
  });

  expect(response.status).toBe(201);
  expect(response.body.message).toBe("User registered successfully");
  expect(response.body.user.email).toBe(TEST_EMAIL);
});
