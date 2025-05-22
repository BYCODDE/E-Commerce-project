import request from "supertest";
import app from "@/server";
import { clearTestUser } from "@/test/utils/testUtils";
import { register } from "@/modules/auth/services/register";
import { login } from "@/modules/auth/services/login";
const TEST_EMAIL = `integration-${Date.now()}@example.com`;
const TEST_PASSWORD = "password123";

let accessToken: string;

beforeAll(async () => {
  await clearTestUser(TEST_EMAIL);
  await register({
    name: "John Doe",
    email: TEST_EMAIL,
    age: 20,
    phone: "+1234567890",
    password: TEST_PASSWORD,
  });

  const loginResult = await login({
    email: TEST_EMAIL,
    password: TEST_PASSWORD,
  });

  accessToken = loginResult.accessToken;
});

afterAll(async () => {
  await clearTestUser(TEST_EMAIL);
});

it("GET /api/auth/logout should logout the user", async () => {
  const response = await request(app)
    .get("/api/auth/logout")
    .set("Cookie", `accessToken=${accessToken}`);

  expect(response.body.message).toBe("Logout successful");
});
