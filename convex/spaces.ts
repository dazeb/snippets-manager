import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    const spaces = await ctx.db
      .query("spaces")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    return spaces.sort((a, b) => b._creationTime - a._creationTime);
  },
});

export const get = query({
  args: { id: v.id("spaces") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }

    const space = await ctx.db.get(args.id);
    if (!space || space.userId !== userId) {
      return null;
    }

    return space;
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    return await ctx.db.insert("spaces", {
      ...args,
      userId,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("spaces"),
    name: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const space = await ctx.db.get(args.id);
    if (!space || space.userId !== userId) {
      throw new Error("Space not found");
    }

    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
  },
});

export const remove = mutation({
  args: { id: v.id("spaces") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const space = await ctx.db.get(args.id);
    if (!space || space.userId !== userId) {
      throw new Error("Space not found");
    }

    // Check if space has snippets
    const snippets = await ctx.db
      .query("snippets")
      .withIndex("by_space", (q) => q.eq("spaceId", args.id))
      .first();

    if (snippets) {
      throw new Error("Cannot delete space with snippets. Please move or delete all snippets first.");
    }

    await ctx.db.delete(args.id);
  },
});

export const getSnippetCount = query({
  args: { spaceId: v.id("spaces") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return 0;
    }

    const snippets = await ctx.db
      .query("snippets")
      .withIndex("by_user_and_space", (q) =>
        q.eq("userId", userId).eq("spaceId", args.spaceId)
      )
      .collect();

    return snippets.length;
  },
});

export const getNoteCount = query({
  args: { spaceId: v.id("spaces") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return 0;
    }

    const notes = await ctx.db
      .query("notes")
      .withIndex("by_user_and_space", (q) =>
        q.eq("userId", userId).eq("spaceId", args.spaceId)
      )
      .collect();

    return notes.length;
  },
});

export const getContentCounts = query({
  args: { spaceId: v.id("spaces") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return { snippets: 0, notes: 0 };
    }

    const [snippets, notes] = await Promise.all([
      ctx.db
        .query("snippets")
        .withIndex("by_user_and_space", (q) =>
          q.eq("userId", userId).eq("spaceId", args.spaceId)
        )
        .collect(),
      ctx.db
        .query("notes")
        .withIndex("by_user_and_space", (q) =>
          q.eq("userId", userId).eq("spaceId", args.spaceId)
        )
        .collect()
    ]);

    return {
      snippets: snippets.length,
      notes: notes.length,
    };
  },
});

export const createDefaultSpace = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Check if user already has spaces
    const existingSpaces = await ctx.db
      .query("spaces")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (existingSpaces) {
      return existingSpaces._id;
    }

    // Create default space
    const spaceId = await ctx.db.insert("spaces", {
      name: "My Snippets",
      description: "Default space for your code snippets",
      userId,
    });

    return spaceId;
  },
});

export const migrateOrphanedSnippets = mutation({
  args: { spaceId: v.id("spaces") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Verify space belongs to user
    const space = await ctx.db.get(args.spaceId);
    if (!space || space.userId !== userId) {
      throw new Error("Space not found");
    }

    // Find snippets and notes without spaceId
    const [orphanedSnippets, orphanedNotes] = await Promise.all([
      ctx.db
        .query("snippets")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .collect(),
      ctx.db
        .query("notes")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .collect()
    ]);

    let migratedCount = 0;

    // Migrate orphaned snippets
    for (const snippet of orphanedSnippets) {
      if (!snippet.spaceId) {
        await ctx.db.patch(snippet._id, { spaceId: args.spaceId });
        migratedCount++;
      }
    }

    // Migrate orphaned notes
    for (const note of orphanedNotes) {
      if (!note.spaceId) {
        await ctx.db.patch(note._id, { spaceId: args.spaceId });
        migratedCount++;
      }
    }

    return migratedCount;
  },
});
