"use client";

import { useApp } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bot, Radio, Eye, BarChart3, Brain, MessageSquare, Image as ImageIcon, AlertCircle, Activity, Settings, Sparkles } from "lucide-react";

const ENGINES = [
  {
    icon: MessageSquare,
    name: "Text Engine",
    color: "text-primary",
    desc: "Antenna theory, HFSS workflow, design guidance, optimization strategies, research paper analysis.",
    examples: ["Explain why my patch resonates at 2.21 GHz instead of 2.45 GHz", "What substrate should I use for a 5.8 GHz antenna?", "How do I tune a U-slot for 5.5 GHz?"],
  },
  {
    icon: Eye,
    name: "Vision Engine",
    color: "text-warn",
    desc: "HFSS screenshot analysis. Identifies geometry, ports, boundaries, plots, units. Distinguishes detected-visually from confirmed-by-HFSS-data.",
    examples: ["Upload HFSS screenshot — verify radiation boundary", "Is this port assignment correct?", "What's wrong with this mesh?"],
  },
  {
    icon: BarChart3,
    name: "Data Engine",
    color: "text-pass",
    desc: "S11, VSWR, gain, bandwidth, pattern analysis. Compares against target spec, gives PASS/WARN/FAIL verdict, recommends next experiment.",
    examples: ["Analyze S11: target 2.45, sim 2.43, min -31 dB, BW 240 MHz", "Compare 3 design versions", "Why is my gain below 5 dBi?"],
  },
];

const FUNCTIONS = [
  { icon: MessageSquare, label: "Ask Question" },
  { icon: Sparkles, label: "What Do I Do Next?" },
  { icon: Bot, label: "Explain This" },
  { icon: ImageIcon, label: "Upload HFSS Screenshot" },
  { icon: AlertCircle, label: "Analyze Error" },
  { icon: Activity, label: "Analyze S11" },
  { icon: Activity, label: "Analyze VSWR" },
  { icon: Radio, label: "Analyze Gain" },
  { icon: Radio, label: "Analyze Radiation Pattern" },
  { icon: Activity, label: "Analyze Current Distribution" },
  { icon: BarChart3, label: "Compare Designs" },
  { icon: Settings, label: "Suggest Optimization" },
  { icon: Brain, label: "Explain Research Papers" },
];

export function AICopilotInfoView() {
  const setView = useApp((s) => s.setView);

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="mb-10 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/5 text-primary text-xs font-mono mb-3">
          <Bot className="w-3 h-3" />
          AIVA · ANTENNA INTELLIGENCE & VIRTUAL ASSISTANT
        </div>
        <h1 className="text-4xl font-bold mb-3">AIVA — Your Antenna Copilot</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          AIVA is built from three specialized engines — not a single generic chatbot. Each engine handles a different type of antenna engineering problem.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-12">
        {ENGINES.map((e) => (
          <Card key={e.name} className="bg-card/60 border-border">
            <CardHeader>
              <div className={`w-10 h-10 rounded-md border border-border flex items-center justify-center ${e.color} bg-secondary`}>
                <e.icon className="w-5 h-5" />
              </div>
              <CardTitle className="text-base mt-2">{e.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground leading-relaxed mb-3">{e.desc}</p>
              <div className="space-y-1.5">
                {e.examples.map((ex, i) => (
                  <div key={i} className="text-xs font-mono text-muted-foreground bg-secondary/40 px-2 py-1.5 rounded border border-border">
                    "{ex}"
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-card/40 border-border mb-6">
        <CardHeader>
          <CardTitle className="text-base">What AIVA Can Do</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {FUNCTIONS.map((f) => (
              <div key={f.label} className="flex items-center gap-2 p-2 rounded-md border border-border bg-card/40 text-sm">
                <f.icon className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                <span>{f.label}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-primary/5 border-primary/30 mb-6">
        <CardHeader>
          <CardTitle className="text-base">How AIVA Reasons</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground leading-relaxed space-y-3">
            <p>
              <span className="text-foreground font-medium">Project memory:</span> AIVA remembers your project context — target spec, geometry, substrate, latest simulation result, current HFSS step, previous parameter changes. You don't need to re-explain your design with every question.
            </p>
            <p>
              <span className="text-foreground font-medium">Honest about uncertainty:</span> When you upload a screenshot, AIVA clearly distinguishes "I can see X" from "I cannot verify Y from this screenshot alone" — and recommends what to check next in HFSS data.
            </p>
            <p>
              <span className="text-foreground font-medium">Cause-and-effect first:</span> When diagnosing a problem, AIVA recommends changing ONE variable at a time — so you can attribute each change to its effect. It explicitly warns against sweeping everything simultaneously.
            </p>
            <p>
              <span className="text-foreground font-medium">Always actionable:</span> Every AIVA response ends with "NEXT STEP:" — a single concrete action you can take immediately.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="text-center">
        <Badge variant="outline" className="mb-3 text-primary border-primary/40">FLOATING COPILOT</Badge>
        <p className="text-sm text-muted-foreground mb-4">
          AIVA is available as a floating button in the bottom-right corner on every page. Click to open the panel.
        </p>
        <button
          onClick={() => {
            window.dispatchEvent(new CustomEvent("aiva-open"));
            setView("home");
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-medium"
        >
          <Bot className="w-4 h-4" />
          Open AIVA Now
        </button>
      </div>
    </div>
  );
}
