"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Radio, Target, BookOpen, Cpu, Bot, GitBranch } from "lucide-react";

export function AboutView() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="text-center mb-10">
        <div className="w-16 h-16 mx-auto rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center mb-4">
          <Radio className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-4xl font-bold mb-3">About ANTENNAIQ</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          AI-Powered Antenna Intelligence & Design Laboratory
        </p>
      </div>

      <Card className="bg-card/40 border-border mb-6">
        <CardContent className="pt-6">
          <h2 className="text-lg font-semibold mb-3">Mission</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            ANTENNAIQ is a complete AI-assisted virtual antenna laboratory that takes learners from antenna fundamentals and analytical calculations through step-by-step HFSS modeling, screenshot-based guidance, simulation-result analysis, troubleshooting, parameter optimization, dual-band design, and automated technical reporting. It exists because the gap between antenna theory in textbooks and actually designing a working antenna in HFSS is enormous — most students spend weeks on what should take an afternoon, lost in HFSS menus and unable to interpret their own simulation results. AIVA closes that gap.
          </p>
        </CardContent>
      </Card>

      <Card className="bg-card/40 border-border mb-6">
        <CardContent className="pt-6">
          <h2 className="text-lg font-semibold mb-3">Tagline</h2>
          <p className="text-primary font-mono text-center text-xl">Learn · Design · Simulate · Analyze · Optimize</p>
        </CardContent>
      </Card>

      <Card className="bg-card/40 border-border mb-6">
        <CardContent className="pt-6">
          <h2 className="text-lg font-semibold mb-3">What Makes ANTENNAIQ Different</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Target className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-sm mb-1">End-to-end pipeline, not separate pages</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">Login → Learn → Define → Calculate → Design → HFSS → Simulate → Analyze → Debug → Optimize → Validate → Report → Research. The platform remembers your project context throughout.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <BookOpen className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-sm mb-1">Theory + practice + AI in one place</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">Each lesson has theory, key points, examples, and HFSS applications. Each HFSS step has reference visuals and AIVA hints. AIVA uses vision + data + text reasoning to actually understand your design.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Cpu className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-sm mb-1">HFSS-first, not HFSS-replacement</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">ANTENNAIQ does not pretend to be HFSS. You run real HFSS simulations on your local machine; ANTENNAIQ provides the workflow, calculations, AI analysis, and reporting layer on top.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Bot className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-sm mb-1">AIVA is honest about uncertainty</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">When AIVA looks at a screenshot, it clearly distinguishes "I can see X" from "I cannot verify Y from this screenshot alone". When it proposes research ideas, it labels them as hypotheses needing validation.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <GitBranch className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-sm mb-1">Cause-and-effect optimization</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">AIVA always recommends changing ONE variable at a time — so each parameter sweep teaches you the physics of your antenna, not just the answer.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-primary/5 border-primary/30">
        <CardContent className="pt-6">
          <h2 className="text-lg font-semibold mb-3">Roadmap</h2>
          <div className="space-y-3 text-sm">
            <div>
              <div className="font-mono text-xs text-pass mb-1">MVP · CURRENT</div>
              <p className="text-xs text-muted-foreground">Dashboard, Antenna Learning, Design Calculator, HFSS Step-by-Step, Screenshot AI, S11 Analyzer, Project Workspace.</p>
            </div>
            <div>
              <div className="font-mono text-xs text-warn mb-1">PHASE 2 · NEXT</div>
              <p className="text-xs text-muted-foreground">Research Center (full paper analyzer), Faculty Mode, Advanced Optimization (multi-objective), HFSS script generation, automated result import.</p>
            </div>
            <div>
              <div className="font-mono text-xs text-muted-foreground mb-1">PHASE 3 · FUTURE</div>
              <p className="text-xs text-muted-foreground">Direct HFSS workflow integration (subject to API/licensing), collaborative projects, published paper library with peer review.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
