/** @vitest-environment jsdom */
import { useState } from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { readHomeView, toggleHomeView, writeHomeView, type HomeView } from "@/lib/home-view";
import { HomeViewToggle } from "./HomeViewToggle";

function Harness() {
  const [view, setView] = useState<HomeView>("chat");
  return (
    <div>
      <p data-testid="view">{view}</p>
      <HomeViewToggle
        view={view}
        onToggle={() => {
          const next = toggleHomeView(view);
          writeHomeView(window.localStorage, "user-1", next);
          setView(next);
        }}
      />
    </div>
  );
}

describe("HomeViewToggle", () => {
  afterEach(() => {
    cleanup();
    window.localStorage.clear();
  });

  it("switches between chat and dashboard and stores the choice", () => {
    render(<Harness />);
    const button = screen.getByTestId("home-view-toggle");
    expect(button.getAttribute("aria-label")).toBe("Show dashboard");
    expect(screen.getByTestId("view").textContent).toBe("chat");

    fireEvent.click(button);
    expect(screen.getByTestId("view").textContent).toBe("dashboard");
    expect(screen.getByTestId("home-view-toggle").getAttribute("aria-label")).toBe("Show chat");
    expect(readHomeView(window.localStorage, "user-1")).toBe("dashboard");

    fireEvent.click(screen.getByTestId("home-view-toggle"));
    expect(screen.getByTestId("view").textContent).toBe("chat");
    expect(readHomeView(window.localStorage, "user-1")).toBe("chat");
  });
});
