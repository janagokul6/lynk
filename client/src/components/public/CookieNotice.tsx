"use client";

import { useEffect, useState } from "react";

export function CookieNotice() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    setVisible(window.localStorage.getItem("lynk-cookie") !== "1");
  }, []);
  if (!visible) return null;
  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-white p-4 text-sm shadow-none dark:bg-slate-900">
      <p>Lynk uses a session cookie to keep you signed in. See the privacy page for what else is stored.</p>
      <button
        type="button"
        className="rounded-lg bg-primary-500 px-3 py-2 font-bold text-white"
        onClick={() => {
          window.localStorage.setItem("lynk-cookie", "1");
          setVisible(false);
        }}
      >
        OK
      </button>
    </div>
  );
}
