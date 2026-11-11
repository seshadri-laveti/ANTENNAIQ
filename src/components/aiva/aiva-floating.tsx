"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Bot } from "lucide-react";

export function AIVAFloatingButton() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("aiva-open", handler);
    return () => window.removeEventListener("aiva-open", handler);
  }, []);

  if (open) return null;

  return (
    <button
      onClick={() => setOpen(true)}
      className="fixed bottom-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg glow transition-all"
      aria-label="Open AIVA AI Copilot"
    >
      <Bot className="w-5 h-5" />
      <span className="text-sm font-medium hidden sm:inline">Ask AIVA</span>
    </button>
  );
}
