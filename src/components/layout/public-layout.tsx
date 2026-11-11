"use client";

import { useState } from "react";
import { useApp } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Radio, Menu } from "lucide-react";

const NAV_LINKS = [
  { key: "home", label: "Home" },
  { key: "how-it-works", label: "How It Works" },
  { key: "features", label: "Features" },
  { key: "antenna-library", label: "Antenna Library" },
  { key: "hfss-learning", label: "HFSS Learning" },
  { key: "ai-copilot-info", label: "AI Copilot" },
  { key: "research", label: "Research" },
  { key: "about", label: "About" },
] as const;

export function PublicLayout({ children }: { children: React.ReactNode }) {
  const view = useApp((s) => s.view);
  const setView = useApp((s) => s.setView);
  const user = useApp((s) => s.user);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <button
            className="flex items-center gap-2 group"
            onClick={() => setView("home")}
          >
            <div className="w-8 h-8 rounded-md bg-primary/10 border border-primary/30 flex items-center justify-center">
              <Radio className="w-4 h-4 text-primary" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-mono text-sm font-bold tracking-wider">ANTENNAIQ</span>
              <span className="text-[10px] text-muted-foreground font-mono">v0.1 · alpha</span>
            </div>
          </button>

          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((l) => (
              <button
                key={l.key}
                onClick={() => setView(l.key)}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                  view === l.key
                    ? "text-foreground bg-secondary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                }`}
              >
                {l.label}
              </button>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-2">
            {user ? (
              <Button size="sm" onClick={() => setView("dashboard")}>
                Dashboard
              </Button>
            ) : (
              <>
                <Button size="sm" variant="ghost" onClick={() => setView("login")}>
                  Login
                </Button>
                <Button size="sm" onClick={() => setView("register")}>
                  Start Designing
                </Button>
              </>
            )}
          </div>

          <div className="lg:hidden">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72">
                <div className="flex flex-col gap-2 mt-6">
                  {NAV_LINKS.map((l) => (
                    <button
                      key={l.key}
                      onClick={() => {
                        setView(l.key);
                        setMobileOpen(false);
                      }}
                      className={`text-left px-3 py-2 text-sm rounded-md ${
                        view === l.key ? "bg-secondary text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {l.label}
                    </button>
                  ))}
                  <div className="border-t border-border mt-4 pt-4 flex flex-col gap-2">
                    {user ? (
                      <Button onClick={() => { setView("dashboard"); setMobileOpen(false); }}>
                        Dashboard
                      </Button>
                    ) : (
                      <>
                        <Button variant="outline" onClick={() => { setView("login"); setMobileOpen(false); }}>
                          Login
                        </Button>
                        <Button onClick={() => { setView("register"); setMobileOpen(false); }}>
                          Start Designing
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col">{children}</main>

      <footer className="mt-auto border-t border-border bg-background">
        <div className="container mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-2">
              <Radio className="w-4 h-4 text-primary" />
              <span className="font-mono font-bold tracking-wider">ANTENNAIQ</span>
            </div>
            <p className="text-muted-foreground text-xs leading-relaxed">
              AI-Powered Antenna Intelligence & Design Laboratory. Learn · Design · Simulate · Analyze · Optimize.
            </p>
          </div>
          <div>
            <div className="font-semibold mb-2 text-xs uppercase tracking-wider text-muted-foreground">Learn</div>
            <div className="flex flex-col gap-1.5">
              <button onClick={() => setView("antenna-library")} className="text-muted-foreground hover:text-foreground text-left">Antenna Library</button>
              <button onClick={() => setView("learning-center")} className="text-muted-foreground hover:text-foreground text-left">Theory Lessons</button>
              <button onClick={() => setView("hfss-learning")} className="text-muted-foreground hover:text-foreground text-left">HFSS Tutorials</button>
            </div>
          </div>
          <div>
            <div className="font-semibold mb-2 text-xs uppercase tracking-wider text-muted-foreground">Product</div>
            <div className="flex flex-col gap-1.5">
              <button onClick={() => setView("how-it-works")} className="text-muted-foreground hover:text-foreground text-left">How It Works</button>
              <button onClick={() => setView("features")} className="text-muted-foreground hover:text-foreground text-left">Features</button>
              <button onClick={() => setView("ai-copilot-info")} className="text-muted-foreground hover:text-foreground text-left">AIVA AI</button>
            </div>
          </div>
          <div>
            <div className="font-semibold mb-2 text-xs uppercase tracking-wider text-muted-foreground">Resources</div>
            <div className="flex flex-col gap-1.5">
              <button onClick={() => setView("research")} className="text-muted-foreground hover:text-foreground text-left">Research</button>
              <button onClick={() => setView("experiments")} className="text-muted-foreground hover:text-foreground text-left">Experiments</button>
              <button onClick={() => setView("about")} className="text-muted-foreground hover:text-foreground text-left">About</button>
            </div>
          </div>
        </div>
        <div className="border-t border-border py-3 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} ANTENNAIQ · Built for antenna engineers, students, and researchers
        </div>
      </footer>
    </div>
  );
}
