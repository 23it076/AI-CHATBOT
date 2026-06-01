import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";


// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  firebaseId: text("firebase_id").unique(),
  createdAt: timestamp("created_at").defaultNow()
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  firebaseId: true
});

// Chat message model
export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  content: text("content").notNull(),
  isUserMessage: boolean("is_user_message").notNull(),
  timestamp: timestamp("timestamp").defaultNow()
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).pick({
  userId: true,
  content: true,
  isUserMessage: true
});

// College cutoffs model
export const collegeCutoffs = pgTable("college_cutoffs", {
  id: serial("id").primaryKey(),
  university: text("university").notNull(),
  program: text("program").notNull(),
  country: text("country").notNull(),
  gpa: text("gpa").notNull(),
  testScores: text("test_scores").notNull(),
  acceptanceRate: text("acceptance_rate").notNull(),
  academicYear: text("academic_year").notNull()
});

export const insertCollegeCutoffSchema = createInsertSchema(collegeCutoffs).pick({
  university: true,
  program: true,
  country: true,
  gpa: true,
  testScores: true,
  acceptanceRate: true,
  academicYear: true
});

// Scholarship model
export const scholarships = pgTable("scholarships", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  amount: text("amount").notNull(),
  fieldOfStudy: text("field_of_study").notNull(),
  deadline: text("deadline").notNull(),
  eligibility: text("eligibility").notNull(),
  description: text("description").notNull()
});

export const insertScholarshipSchema = createInsertSchema(scholarships).pick({
  name: true,
  amount: true,
  fieldOfStudy: true,
  deadline: true,
  eligibility: true,
  description: true
});

// Chat message type