import request from "supertest";
import app from "@/server";
import { clearTestUser } from "@/test/utils/testUtils";
import { register } from "@/modules/auth/services/register";
import { login } from "@/modules/auth/services/login";
const TEST_EMAIL = `integration-${Date.now()}@example.com`;
const TEST_PASSWORD = "password123";

let refreshToken: string;
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

  refreshToken = loginResult.refreshToken;
  accessToken = loginResult.accessToken;
});

afterAll(async () => {
  await clearTestUser(TEST_EMAIL);
});

it("GET /api/auth/refresh should refresh the access token", async () => {
  const response = await request(app)
    .get("/api/auth/refresh")
    .set("Cookie", `refreshToken=${refreshToken}`);

  expect(response.status).toBe(200);
  expect(response.body.message).toBe("Token refreshed");
  expect(response.body.accessToken).toBeDefined();
  expect(response.body.refreshToken).toBeDefined();
});
