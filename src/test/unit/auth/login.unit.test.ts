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

describe("POST /api/auth/login", () => {
  it("should successfully login with valid credentials", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
    });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Login  successful");
    expect(response.body.user.email).toBe(TEST_EMAIL);
    expect(response.body.user.name).toBe("John Doe");

    const cookies = response.headers["set-cookie"] as unknown as string[];
    expect(cookies).toBeDefined();
    expect(cookies.some((cookie) => cookie.startsWith("accessToken="))).toBe(
      true
    );
    expect(cookies.some((cookie) => cookie.startsWith("refreshToken="))).toBe(
      true
    );
  });

  it("should return 400 for invalid email format", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: "invalid-email",
      password: TEST_PASSWORD,
    });

    expect(response.status).toBe(400);
  });

  it("should return 400 for password less than 6 characters", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: TEST_EMAIL,
      password: "12345",
    });

    expect(response.status).toBe(400);
  });

  it("should return 401 for non-existent user", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: "nonexistent@example.com",
      password: TEST_PASSWORD,
    });

    expect(response.status).toBe(401);
  });

  it("should return 401 for wrong password", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: TEST_EMAIL,
      password: "wrongpassword",
    });

    expect(response.status).toBe(401);
  });
});
