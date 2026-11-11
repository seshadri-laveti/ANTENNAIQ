"use client";

import { useApp } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ANTENNA_LIBRARY } from "@/lib/antenna-data";
import { ArrowRight, Radio, BookOpen } from "lucide-react";

export function AntennaLibraryView() {
  const openLibrary = useApp((s) => s.openLibrary);
  const families = Array.from(new Set(ANTENNA_LIBRARY.map((a) => a.family)));

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="mb-10 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/5 text-primary text-xs font-mono mb-3">
          <Radio className="w-3 h-3" />
          KNOWLEDGE BASE
        </div>
        <h1 className="text-4xl font-bold mb-3">Antenna Library</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Each antenna type includes overview, operating principle, applications, advantages, limitations, design equations, typical dimensions, HFSS procedure, expected results, optimization tips, and research ideas.
        </p>
      </div>

      <div className="space-y-8">
        {families.map((family) => {
          const items = ANTENNA_LIBRARY.filter((a) => a.family === family);
          return (
            <div key={family}>
              <div className="flex items-center gap-2 mb-3">
                <h2 className="text-lg font-semibold">{family}</h2>
                <Badge variant="outline" className="text-xs">{items.length}</Badge>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((item) => (
                  <Card
                    key={item.id}
                    className="bg-card/60 border-border hover:border-primary/40 hover:bg-card transition-colors cursor-pointer"
                    onClick={() => openLibrary(item.id)}
                  >
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center justify-between">
                        <span>{item.name}</span>
                        <ArrowRight className="w-4 h-4 text-muted-foreground" />
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">{item.summary}</p>
                      <div className="mt-3 flex flex-wrap gap-1">
                        {item.applications.slice(0, 3).map((a) => (
                          <Badge key={a} variant="secondary" className="text-[10px]">{a}</Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <Card className="mt-12 bg-primary/5 border-primary/30">
        <CardContent className="pt-6 flex items-center gap-4">
          <BookOpen className="w-8 h-8 text-primary flex-shrink-0" />
          <div>
            <h3 className="font-semibold mb-1">Want theory behind these antennas?</h3>
            <p className="text-sm text-muted-foreground">
              The Learning Center has 16 modules covering antenna fundamentals, EM theory, transmission lines, S-parameters, VSWR, gain, bandwidth, microstrip theory, multi-band antennas, DGS, MIMO, and optimization.
            </p>
          </div>
          <Button variant="outline" onClick={() => useApp.getState().setView("learning-center")}>
            Open Learning Center
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
