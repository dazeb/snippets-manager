import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  spaces: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    userId: v.id("users"),
  })
    .index("by_user", ["userId"]),

  snippets: defineTable({
    title: v.string(),
    code: v.string(),
    language: v.string(),
    description: v.optional(v.string()),
    tags: v.array(v.string()),
    project: v.optional(v.string()),
    userId: v.id("users"),
    spaceId: v.optional(v.id("spaces")),
  })
    .index("by_user", ["userId"])
    .index("by_space", ["spaceId"])
    .index("by_user_and_space", ["userId", "spaceId"])
    .index("by_user_and_language", ["userId", "language"])
    .index("by_user_and_project", ["userId", "project"])
    .searchIndex("search_snippets", {
      searchField: "title",
      filterFields: ["userId", "spaceId", "language", "project"],
    }),

  notes: defineTable({
    title: v.string(),
    content: v.string(),
    description: v.optional(v.string()),
    tags: v.array(v.string()),
    project: v.optional(v.string()),
    userId: v.id("users"),
    spaceId: v.optional(v.id("spaces")),
  })
    .index("by_user", ["userId"])
    .index("by_space", ["spaceId"])
    .index("by_user_and_space", ["userId", "spaceId"])
    .index("by_user_and_project", ["userId", "project"])
    .searchIndex("search_notes", {
      searchField: "title",
      filterFields: ["userId", "spaceId", "project"],
    }),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
