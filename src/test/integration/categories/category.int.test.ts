import request from "supertest";
import app from "@/server";
import { register } from "@/modules/auth/services/register";
import { db } from "@/db";
import { categories, users } from "@/db/schema";
import { eq } from "drizzle-orm";

const email = `catadmin_${Date.now()}@test.com`;
let adminCookie: string[];
let testCategoryId: string;

beforeAll(async () => {
  await register({
    name: "Cat Admin",
    age: 30,
    email,
    password: "catpass123",
    phone: "+995591234567",
  });

  await db.update(users).set({ role: "ADMIN" }).where(eq(users.email, email));

  const res = await request(app).post("/api/auth/login").send({
    email,
    password: "catpass123",
  });

  adminCookie = Array.isArray(res.headers["set-cookie"])
    ? res.headers["set-cookie"]
    : [];
});

afterAll(async () => {
  // Delete the test category by slug
  await db.delete(categories).where(eq(categories.slug, "test-category"));
});

test("POST /api/categories — create category", async () => {
  const res = await request(app)
    .post("/api/categories")
    .set("Cookie", adminCookie)
    .send({
      name: { en: "Test Category", ka: "ტესტი", ru: "Тест" },
      slug: "test-category",
      parentId: null,
      nested: false,
    });

  expect(res.statusCode).toBe(201);
  expect(res.body.message).toBe("Category created successfully");
  expect(res.body.category.slug).toBe("test-category");
  testCategoryId = res.body.category.id;
});

test("GET /api/categories — get all categories", async () => {
  const res = await request(app).get("/api/categories");

  expect(res.statusCode).toBe(200);
  expect(res.body.categories.length).toBe(1);
  expect(res.body.categories[0].slug).toBe("test-category");
});

test("GET /api/categories/:id — get category by id", async () => {
  const res = await request(app).get(`/api/categories/${testCategoryId}`);

  expect(res.statusCode).toBe(200);
  expect(res.body.category.id).toBeDefined();
});

test("PUT /api/categories/:id — update category", async () => {
  const res = await request(app)
    .put(`/api/categories/${testCategoryId}`)
    .set("Cookie", adminCookie)
    .send({
      name: {
        en: "Updated Category",
        ka: "განახლებული კატეგორია",
        ru: "Обновленная категория",
      },
    });

  expect(res.statusCode).toBe(200);
  expect(res.body.message).toBe("Category updated successfully");
  expect(res.body.category.slug).toBe("test-category");
});

test("DELETE /api/categories/:id — delete category", async () => {
  const res = await request(app)
    .delete(`/api/categories/${testCategoryId}`)
    .set("Cookie", adminCookie);

  expect(res.statusCode).toBe(200);
  expect(res.body.message).toBe("Category deleted successfully");
});

// TODO: and add the swagger logic
