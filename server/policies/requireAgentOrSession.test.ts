import { beforeEach, describe, expect, it, vi } from "vitest";
import type { NextFunction, Request, Response } from "express";

vi.mock("../config/env.js", () => ({
  env: { AGENT_API_KEY: "lynk-dev-agent-key-16" },
}));

const getSession = vi.fn();

vi.mock("../lib/auth.js", () => ({
  auth: {
    api: {
      getSession: (...args: unknown[]) => getSession(...args),
    },
  },
}));

vi.mock("better-auth/node", () => ({
  fromNodeHeaders: (headers: unknown) => headers,
}));

describe("requireAgentOrSession", () => {
  beforeEach(() => {
    getSession.mockReset();
  });

  it("allows a matching agent key", async () => {
    getSession.mockResolvedValue(null);
    const { requireAgentOrSession } = await import("./requireAgentOrSession.js");

    const req = {
      header: (name: string) => (name === "x-agent-key" ? "lynk-dev-agent-key-16" : undefined),
      headers: {},
    } as unknown as Request;
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() } as unknown as Response;
    const next = vi.fn() as NextFunction;

    await requireAgentOrSession(req, res, next);
    expect(next).toHaveBeenCalledOnce();
    expect(res.status).not.toHaveBeenCalled();
    expect((req as { agentAuth?: string }).agentAuth).toBe("key");
  });

  it("rejects a key that does not match", async () => {
    getSession.mockResolvedValue(null);
    const { requireAgentOrSession } = await import("./requireAgentOrSession.js");
    const req = {
      header: (name: string) => (name === "x-agent-key" ? "not-the-agent-key" : undefined),
      headers: {},
    } as unknown as Request;
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() } as unknown as Response;
    const next = vi.fn() as NextFunction;
    await requireAgentOrSession(req, res, next);
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it("allows a session without agent key", async () => {
    getSession.mockResolvedValue({ user: { id: "user_1" } });
    const { requireAgentOrSession } = await import("./requireAgentOrSession.js");

    const req = {
      header: () => undefined,
      headers: {},
    } as unknown as Request;
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() } as unknown as Response;
    const next = vi.fn() as NextFunction;

    await requireAgentOrSession(req, res, next);
    expect(next).toHaveBeenCalledOnce();
    expect((req as { userId?: string }).userId).toBe("user_1");
  });

  it("rejects when neither session nor agent key is present", async () => {
    getSession.mockResolvedValue(null);
    const { requireAgentOrSession } = await import("./requireAgentOrSession.js");

    const req = {
      header: () => undefined,
      headers: {},
    } as unknown as Request;
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() } as unknown as Response;
    const next = vi.fn() as NextFunction;

    await requireAgentOrSession(req, res, next);
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
  });
});
