import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user-123",
    email: "testuser@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return { ctx };
}

function createUnauthContext(): { ctx: TrpcContext } {
  const ctx: TrpcContext = {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return { ctx };
}

describe("email.send", () => {
  it("sends email successfully for authenticated user", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.email.send({
      to: "guest@example.com",
      subject: "Invitation to Front Row Challenge",
      body: "Dear Guest, we would like to invite you to our podcast...",
      candidateName: "Dr. Test Guest",
    });

    expect(result).toMatchObject({
      success: true,
      message: "Email sent to guest@example.com",
    });
    expect(result.sentAt).toBeInstanceOf(Date);
  });

  it("rejects unauthenticated users", async () => {
    const { ctx } = createUnauthContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.email.send({
        to: "guest@example.com",
        subject: "Test",
        body: "Test body",
        candidateName: "Test Guest",
      })
    ).rejects.toThrow();
  });
});

describe("episodes router", () => {
  it("lists episodes for authenticated user", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.episodes.list();
    
    expect(Array.isArray(result)).toBe(true);
  });

  it("rejects unauthenticated users for episode list", async () => {
    const { ctx } = createUnauthContext();
    const caller = appRouter.createCaller(ctx);

    await expect(caller.episodes.list()).rejects.toThrow();
  });
});
