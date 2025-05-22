import request from "supertest";
import app from "@/server";
import { clearTestUser } from "@/test/utils/testUtils";
import { register } from "@/modules/auth/services/register";

const TEST_EMAIL = `integration-${Date.now()}@example.com`;
const TEST_PASSWORD = "password123";

beforeAll(async () => {
  await clearTestUser(TEST_EMAIL);
  await register({
    name: "John Doe",
    email: TEST_EMAIL,
    age: 20,
    phone: "+1234567890",
    password: TEST_PASSWORD,
  });
});

afterAll(async () => {
  await clearTestUser(TEST_EMAIL);
});


test("POST /api/auth/login", async () => {
  const response = await request(app).post("/api/auth/login").send({
    email: TEST_EMAIL,
    password: TEST_PASSWORD,
  });

  expect(response.status).toBe(200);
  expect(response.body.message).toBe("Login  successful");
  expect(response.body.user.email).toBe(TEST_EMAIL);
});
