import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const list = query({
  args: {
    spaceId: v.optional(v.id("spaces")),
    project: v.optional(v.string()),
    search: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    let notes;

    if (args.search && args.spaceId) {
      notes = await ctx.db
        .query("notes")
        .withSearchIndex("search_notes", (q) =>
          q.search("title", args.search!)
           .eq("userId", userId)
           .eq("spaceId", args.spaceId)
        )
        .collect();
    } else if (args.spaceId) {
      notes = await ctx.db
        .query("notes")
        .withIndex("by_user_and_space", (q) => 
          q.eq("userId", userId).eq("spaceId", args.spaceId)
        )
        .collect();
    } else {
      // Fallback for migration - get all user notes
      notes = await ctx.db
        .query("notes")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .collect();
    }

    // Apply additional filters
    if (args.project) {
      notes = notes.filter((note) => note.project === args.project);
    }

    return notes.sort((a, b) => b._creationTime - a._creationTime);
  },
});

export const get = query({
  args: { id: v.id("notes") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }

    const note = await ctx.db.get(args.id);
    if (!note || note.userId !== userId) {
      return null;
    }

    return note;
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    description: v.optional(v.string()),
    tags: v.array(v.string()),
    project: v.optional(v.string()),
    spaceId: v.id("spaces"),
  },
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

    return await ctx.db.insert("notes", {
      ...args,
      userId,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("notes"),
    title: v.string(),
    content: v.string(),
    description: v.optional(v.string()),
    tags: v.array(v.string()),
    project: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const note = await ctx.db.get(args.id);
    if (!note || note.userId !== userId) {
      throw new Error("Note not found");
    }

    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
  },
});

export const remove = mutation({
  args: { id: v.id("notes") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const note = await ctx.db.get(args.id);
    if (!note || note.userId !== userId) {
      throw new Error("Note not found");
    }

    await ctx.db.delete(args.id);
  },
});

export const getProjects = query({
  args: { spaceId: v.optional(v.id("spaces")) },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    const notes = args.spaceId 
      ? await ctx.db
          .query("notes")
          .withIndex("by_user_and_space", (q) => 
            q.eq("userId", userId).eq("spaceId", args.spaceId)
          )
          .collect()
      : await ctx.db
          .query("notes")
          .withIndex("by_user", (q) => q.eq("userId", userId))
          .collect();

    const projects = [...new Set(notes.map((n) => n.project).filter(Boolean))];
    return projects.sort();
  },
});
