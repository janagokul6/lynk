export type HomeView = "chat" | "dashboard";

export function homeViewKey(userId: string): string {
  return `lynk.home.view.${userId}`;
}

export function readHomeView(storage: Pick<Storage, "getItem">, userId: string): HomeView {
  return storage.getItem(homeViewKey(userId)) === "dashboard" ? "dashboard" : "chat";
}

export function writeHomeView(
  storage: Pick<Storage, "setItem">,
  userId: string,
  view: HomeView
): void {
  storage.setItem(homeViewKey(userId), view);
}

export function toggleHomeView(view: HomeView): HomeView {
  return view === "chat" ? "dashboard" : "chat";
}
