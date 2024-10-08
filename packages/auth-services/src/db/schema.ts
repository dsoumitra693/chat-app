import { serial, text, timestamp, pgTable } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: serial("id").primaryKey(), // Auto-incrementing primary key
  name: text("name").notNull(), // Name field, required
  phone: text("phone").notNull().unique(), // Phone number, must be unique
  password: text("password").notNull(), // Hashed password field, required
  createdAt: timestamp("created_at").defaultNow(), // Set the current timestamp on insert
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdateFn(() => new Date()), // Set the current timestamp on updates
});
