"use client";

import { useState } from "react";
import { useApp } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Radio, Menu, LayoutDashboard, Plus, BookOpen, Radio as RadioIcon, FlaskConical, FileText, LogOut } from "lucide-react";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const view = useApp((s) => s.view);
  const setView = useApp((s) => s.setView);
  const user = useApp((s) => s.user);
  const logout = useApp((s) => s.logout);
  const projects = useApp((s) => s.projects);
  const setActiveProject = useApp((s) => s.setActiveProject);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              className="flex items-center gap-2"
              onClick={() => setView("dashboard")}
            >
              <div className="w-8 h-8 rounded-md bg-primary/10 border border-primary/30 flex items-center justify-center">
                <Radio className="w-4 h-4 text-primary" />
              </div>
              <div className="hidden sm:flex flex-col leading-none">
                <span className="font-mono text-sm font-bold tracking-wider">ANTENNAIQ</span>
                <span className="text-[10px] text-muted-foreground font-mono">workspace</span>
              </div>
            </button>

            <nav className="hidden md:flex items-center gap-1 ml-4">
              <NavBtn icon={<LayoutDashboard className="w-3.5 h-3.5" />} label="Dashboard" active={view === "dashboard"} onClick={() => setView("dashboard")} />
              <NavBtn icon={<Plus className="w-3.5 h-3.5" />} label="New Project" active={view === "new-project"} onClick={() => setView("new-project")} />
              <NavBtn icon={<BookOpen className="w-3.5 h-3.5" />} label="Learn" active={false} onClick={() => setView("learning-center")} />
              <NavBtn icon={<RadioIcon className="w-3.5 h-3.5" />} label="Library" active={false} onClick={() => setView("antenna-library")} />
              <NavBtn icon={<FlaskConical className="w-3.5 h-3.5" />} label="Experiments" active={false} onClick={() => setView("experiments")} />
              <NavBtn icon={<FileText className="w-3.5 h-3.5" />} label="Research" active={false} onClick={() => setView("research")} />
            </nav>
          </div>

          <div className="flex items-center gap-2">
            {user && (
              <div className="hidden sm:flex items-center gap-2 text-xs">
                <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center font-mono text-[11px] border border-border">
                  {user.name.slice(0, 2).toUpperCase()}
                </div>
                <span className="text-muted-foreground">{user.name}</span>
              </div>
            )}
            <Button size="sm" variant="ghost" onClick={logout}>
              <LogOut className="w-3.5 h-3.5 mr-1" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
            <div className="md:hidden">
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-72">
                  <div className="flex flex-col gap-2 mt-6">
                    <MobileNavBtn icon={<LayoutDashboard className="w-4 h-4" />} label="Dashboard" onClick={() => { setView("dashboard"); setMobileOpen(false); }} />
                    <MobileNavBtn icon={<Plus className="w-4 h-4" />} label="New Project" onClick={() => { setView("new-project"); setMobileOpen(false); }} />
                    <MobileNavBtn icon={<BookOpen className="w-4 h-4" />} label="Learning Center" onClick={() => { setView("learning-center"); setMobileOpen(false); }} />
                    <MobileNavBtn icon={<RadioIcon className="w-4 h-4" />} label="Antenna Library" onClick={() => { setView("antenna-library"); setMobileOpen(false); }} />
                    <MobileNavBtn icon={<FlaskConical className="w-4 h-4" />} label="Experiments" onClick={() => { setView("experiments"); setMobileOpen(false); }} />
                    <MobileNavBtn icon={<FileText className="w-4 h-4" />} label="Research" onClick={() => { setView("research"); setMobileOpen(false); }} />
                    {projects.length > 0 && (
                      <div className="border-t border-border mt-2 pt-2">
                        <div className="text-xs uppercase text-muted-foreground px-3 mb-1">Active Projects</div>
                        {projects.map((p) => (
                          <button
                            key={p.id}
                            onClick={() => { setActiveProject(p.id); setMobileOpen(false); }}
                            className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-secondary"
                          >
                            {p.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col">{children}</main>

      <footer className="mt-auto border-t border-border py-3 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} ANTENNAIQ · AIVA is always available in the bottom-right corner
      </footer>
    </div>
  );
}

function NavBtn({
  icon, label, active, onClick,
}: { icon: React.ReactNode; label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-md transition-colors ${
        active ? "bg-primary/15 text-primary border border-primary/30" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function MobileNavBtn({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-secondary text-left">
      {icon}
      {label}
    </button>
  );
}
