import type { NextFunction, Request, Response } from "express";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../lib/auth.js", () => ({
  auth: {
    api: {
      getSession: vi.fn(),
    },
  },
}));

import { auth } from "../lib/auth.js";
import { requireRole } from "./requireRole.js";

const getSession = auth.api.getSession as unknown as ReturnType<typeof vi.fn>;

function mockResponse(): Response {
  const res = {
    statusCode: 200,
    headersSent: false,
    status(code: number) {
      res.statusCode = code;
      return res;
    },
    json() {
      res.headersSent = true;
      return res;
    },
  };
  return res as unknown as Response;
}

describe("requireRole", () => {
  beforeEach(() => {
    getSession.mockReset();
  });

  it("forwards session lookup failures to the error handler", async () => {
    const failure = new Error("session backend down");
    getSession.mockRejectedValue(failure);
    const next = vi.fn() as NextFunction;
    await requireRole("admin")({ headers: {} } as Request, mockResponse(), next);
    expect(next).toHaveBeenCalledWith(failure);
  });

  it("rejects a signed-in user whose role is not allowed", async () => {
    getSession.mockResolvedValue({
      session: { id: "s", userId: "u" },
      user: { id: "u", role: "brand" },
    });
    const res = mockResponse();
    const next = vi.fn() as NextFunction;
    await requireRole("admin")({ headers: {} } as Request, res, next);
    expect(res.statusCode).toBe(403);
    expect(next).not.toHaveBeenCalled();
  });
});
