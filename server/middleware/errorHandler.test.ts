import express from "express";
import request from "supertest";
import { describe, expect, it } from "vitest";
import { errorHandler } from "./errorHandler.js";

describe("error handler", () => {
  it("returns a generic 500 and never includes SQL or a stack", async () => {
    const app = express();
    app.get("/boom", (_req, _res, next) => {
      next(new Error('failed query: select "token" from "user" where id = $1'));
    });
    app.use(errorHandler);

    const res = await request(app).get("/boom");

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: "Internal Server Error" });
    expect(JSON.stringify(res.body).toLowerCase()).not.toContain("select");
    expect(JSON.stringify(res.body)).not.toContain("$1");
    expect(res.body.stack).toBeUndefined();
  });
});
