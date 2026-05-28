/// <reference types="vite/client" />

import { convexTest } from "convex-test";
import { afterEach, describe, expect, it, vi } from "vitest";

import { api } from "./_generated/api";
import type { Id } from "./_generated/dataModel";
import schema from "./schema";

const modules = import.meta.glob("./**/*.*s");

const createTest = () => convexTest({ modules, schema });

const createUser = async (t: ReturnType<typeof createTest>, email: string) =>
  await t.run(async (ctx) => await ctx.db.insert("users", { email }));

describe("captures", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("creates a pending paste capture owned by the authenticated user", async () => {
    const t = createTest();
    const userId = await createUser(t, "friend@example.com");

    const capture = await t
      .withIdentity({ subject: userId })
      .mutation(api.captures.createFromPaste, {
        source: " https://www.example.com/spots/lilia ",
      });

    expect(capture).toMatchObject({
      isArchived: false,
      rawText: "https://www.example.com/spots/lilia",
      sourceDomain: "example.com",
      sourceType: "paste",
      sourceUrl: "https://www.example.com/spots/lilia",
      status: "pending",
      userId,
    });
    expect(capture?.createdAt).toStrictEqual(expect.any(Number));
  });

  it("rejects unauthenticated capture creation", async () => {
    const t = createTest();

    await expect(
      t.mutation(api.captures.createFromPaste, {
        source: "https://example.com/spots/lilia",
      })
    ).rejects.toThrow("Not authenticated");
  });

  it("lists only the signed-in user's captures in reverse chronological order", async () => {
    vi.useFakeTimers();
    const t = createTest();
    const firstUserId = await createUser(t, "first@example.com");
    const secondUserId = await createUser(t, "second@example.com");
    const asFirstUser = t.withIdentity({ subject: firstUserId });

    vi.setSystemTime(new Date("2026-05-27T10:00:00.000Z"));
    await asFirstUser.mutation(api.captures.createFromPaste, {
      source: "https://example.com/older",
    });

    vi.setSystemTime(new Date("2026-05-27T10:01:00.000Z"));
    const newerCapture = await asFirstUser.mutation(
      api.captures.createFromPaste,
      {
        source: "Notes from a friend about Lilia",
      }
    );

    await t
      .withIdentity({ subject: secondUserId })
      .mutation(api.captures.createFromPaste, {
        source: "https://example.com/not-mine",
      });

    const captures = await asFirstUser.query(api.captures.listMine);

    expect(captures.map((capture) => capture.rawText)).toStrictEqual([
      "Notes from a friend about Lilia",
      "https://example.com/older",
    ]);
    expect(captures.every((capture) => capture.userId === firstUserId)).toBe(
      true
    );
    expect(captures[0]?._id).toBe(newerCapture?._id as Id<"captures">);
  });
});
