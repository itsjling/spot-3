import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,
  captures: defineTable({
    createdAt: v.number(),
    isArchived: v.boolean(),
    rawText: v.string(),
    sourceDomain: v.optional(v.string()),
    sourceType: v.literal("paste"),
    sourceUrl: v.optional(v.string()),
    status: v.literal("pending"),
    userId: v.id("users"),
  }).index("by_userId_and_isArchived_and_createdAt", [
    "userId",
    "isArchived",
    "createdAt",
  ]),
  users: defineTable({
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    image: v.optional(v.string()),
    isAnonymous: v.optional(v.boolean()),
    name: v.optional(v.string()),
    onboardingCompletedAt: v.optional(v.number()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    role: v.optional(v.union(v.literal("user"), v.literal("sysadmin"))),
  }).index("email", ["email"]),
});
