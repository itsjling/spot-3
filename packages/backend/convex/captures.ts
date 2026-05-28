import { getAuthUserId } from "@convex-dev/auth/server";
import { classifyPastedSource } from "@spot/domain";
import { v } from "convex/values";

import { mutation, query } from "./_generated/server";

const requireUserId = async (ctx: Parameters<typeof getAuthUserId>[0]) => {
  const userId = await getAuthUserId(ctx);

  if (userId === null) {
    throw new Error("Not authenticated");
  }

  return userId;
};

export const createFromPaste = mutation({
  args: {
    source: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    const classifiedSource = classifyPastedSource(args.source);

    if (!classifiedSource.rawText) {
      throw new Error("Paste a link or text first");
    }

    const captureId = await ctx.db.insert("captures", {
      createdAt: Date.now(),
      isArchived: false,
      rawText: classifiedSource.rawText,
      sourceType: "paste",
      status: "pending",
      userId,
      ...(classifiedSource.sourceDomain
        ? { sourceDomain: classifiedSource.sourceDomain }
        : {}),
      ...(classifiedSource.sourceUrl
        ? { sourceUrl: classifiedSource.sourceUrl }
        : {}),
    });

    return await ctx.db.get(captureId);
  },
});

export const listMine = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);

    if (userId === null) {
      return [];
    }

    return await ctx.db
      .query("captures")
      .withIndex("by_userId_and_isArchived_and_createdAt", (q) =>
        q.eq("userId", userId).eq("isArchived", false)
      )
      .order("desc")
      .take(50);
  },
});
