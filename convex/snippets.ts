import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const list = query({
  args: {
    spaceId: v.optional(v.id("spaces")),
    language: v.optional(v.string()),
    project: v.optional(v.string()),
    search: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    let snippets;

    if (args.search && args.spaceId) {
      snippets = await ctx.db
        .query("snippets")
        .withSearchIndex("search_snippets", (q) =>
          q.search("title", args.search!)
           .eq("userId", userId)
           .eq("spaceId", args.spaceId)
        )
        .collect();
    } else if (args.spaceId) {
      snippets = await ctx.db
        .query("snippets")
        .withIndex("by_user_and_space", (q) => 
          q.eq("userId", userId).eq("spaceId", args.spaceId)
        )
        .collect();
    } else {
      // Fallback for migration - get all user snippets
      snippets = await ctx.db
        .query("snippets")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .collect();
    }

    // Apply additional filters
    if (args.language) {
      snippets = snippets.filter((snippet) => snippet.language === args.language);
    }
    if (args.project) {
      snippets = snippets.filter((snippet) => snippet.project === args.project);
    }

    return snippets.sort((a, b) => b._creationTime - a._creationTime);
  },
});

export const get = query({
  args: { id: v.id("snippets") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }

    const snippet = await ctx.db.get(args.id);
    if (!snippet || snippet.userId !== userId) {
      return null;
    }

    return snippet;
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    code: v.string(),
    language: v.string(),
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

    return await ctx.db.insert("snippets", {
      ...args,
      userId,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("snippets"),
    title: v.string(),
    code: v.string(),
    language: v.string(),
    description: v.optional(v.string()),
    tags: v.array(v.string()),
    project: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const snippet = await ctx.db.get(args.id);
    if (!snippet || snippet.userId !== userId) {
      throw new Error("Snippet not found");
    }

    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
  },
});

export const remove = mutation({
  args: { id: v.id("snippets") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const snippet = await ctx.db.get(args.id);
    if (!snippet || snippet.userId !== userId) {
      throw new Error("Snippet not found");
    }

    await ctx.db.delete(args.id);
  },
});

export const getLanguages = query({
  args: { spaceId: v.optional(v.id("spaces")) },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    const snippets = args.spaceId 
      ? await ctx.db
          .query("snippets")
          .withIndex("by_user_and_space", (q) => 
            q.eq("userId", userId).eq("spaceId", args.spaceId)
          )
          .collect()
      : await ctx.db
          .query("snippets")
          .withIndex("by_user", (q) => q.eq("userId", userId))
          .collect();

    const languages = [...new Set(snippets.map((s) => s.language))];
    return languages.sort();
  },
});

export const getProjects = query({
  args: { spaceId: v.optional(v.id("spaces")) },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    const snippets = args.spaceId 
      ? await ctx.db
          .query("snippets")
          .withIndex("by_user_and_space", (q) => 
            q.eq("userId", userId).eq("spaceId", args.spaceId)
          )
          .collect()
      : await ctx.db
          .query("snippets")
          .withIndex("by_user", (q) => q.eq("userId", userId))
          .collect();

    const projects = [...new Set(snippets.map((s) => s.project).filter(Boolean))];
    return projects.sort();
  },
});
