import {
  integer,
  pgEnum,
  pgTable,
  timestamp,
  uuid,
  varchar,
  unique,
  text,
  jsonb,
  index,
  boolean,
} from "drizzle-orm/pg-core";

export const userRole = pgEnum("role", ["USER", "ADMIN", "COURIER"]);
export const currency = pgEnum("currency", ["GEL", "USD", "EUR"]);

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: varchar("email", { length: 255 }).notNull(),
    passwordHash: varchar("password_hash").notNull(),
    age: integer("age").notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    phone: varchar("phone", { length: 255 }).notNull(),
    role: userRole("role").notNull().default("USER"),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (t) => [unique("user_email_unique").on(t.email)]
);

export const refreshTokens = pgTable(
  "refresh_tokens",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id),
    token: text("token").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (t) => [
    unique("refresh_token_value_idx").on(t.token),
    unique("refresh_token_user_idx").on(t.userId, t.token),
  ]
);

export const categories = pgTable(
  "categories",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: jsonb("name").notNull(),
    slug: varchar("slug", { length: 255 }).notNull(),
    parentId: uuid("parent_id"),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (t) => [
    unique("categories_slug_unique").on(t.slug),
    unique("categories_parent_idx").on(t.parentId),
  ]
);

export const manufacturers = pgTable(
  "manufacturers",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: jsonb("name").notNull(),
    slug: varchar("slug", { length: 255 }).notNull(),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (t) => [
    unique("manufacturers_slug_unique").on(t.slug),
    index("manufacturers_slug_idx").on(t.slug),
  ]
);

export const products = pgTable(
  "products",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    title: jsonb("title").notNull(),
    description: jsonb("description").notNull(),
    shortDescription: jsonb("short_description").notNull(),

    slug: varchar("slug", { length: 255 }).notNull(),
    price: integer("price").notNull(),
    discountPrice: integer("discount_price"),
    currency: currency("currency").notNull(),

    countInStock: integer("count_in_stock").notNull().default(0),
    availability: boolean("availability").notNull().default(true),
    categoryId: uuid("category_id").references(() => categories.id),
    manufacturerId: uuid("manufacturer_id")
      .references(() => manufacturers.id)
      .notNull(),
    createdBy: uuid("created_by").references(() => users.id),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (t) => [
    unique("products_slug_unique").on(t.slug),
    index("products_category_idx").on(t.categoryId),
    index("products_manufacturer_idx").on(t.manufacturerId),
    index("products_price_idx").on(t.price),
    index("products_availability_idx").on(t.availability),
  ]
);

export const productImages = pgTable(
  "product_images",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id),
    url: text("url").notNull(),
    isPrimary: boolean("is_primary").notNull().default(false),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (t) => [
    index("product_images_product_idx").on(t.productId),
    index("product_images_is_primary_idx").on(t.isPrimary),
  ]
);

export const productAttributes = pgTable(
  "product_attributes",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    productId: uuid("product_id")
      .notNull()
      .references(() => products.id),
    key: jsonb("key").notNull(),
    value: jsonb("value").notNull(),
    keySlug: varchar("key_slug", { length: 255 }).notNull(),
  },
  (t) => [
    index("product_attributes_product_idx").on(t.productId),
    index("product_attributes_key_slug_idx").on(t.keySlug),
  ]
);
