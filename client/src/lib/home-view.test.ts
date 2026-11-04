import { describe, expect, it } from "vitest";
import { readHomeView, toggleHomeView, writeHomeView } from "./home-view";

function memoryStorage() {
  const data = new Map<string, string>();
  return {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => {
      data.set(key, value);
    },
  };
}

describe("home view", () => {
  it("defaults to chat and remembers the last choice per user", () => {
    const storage = memoryStorage();
    expect(readHomeView(storage, "user-1")).toBe("chat");
    writeHomeView(storage, "user-1", "dashboard");
    expect(readHomeView(storage, "user-1")).toBe("dashboard");
    expect(readHomeView(storage, "user-2")).toBe("chat");
    expect(toggleHomeView("dashboard")).toBe("chat");
  });
});
