"use client";

import { useEffect, useRef, useState } from "react";
import { useApp } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Bot, X, Send, Eye, MessageSquare, BarChart3, Image as ImageIcon, Loader2,
  Sparkles, AlertCircle, Radio, Activity, FileText, ArrowRight
} from "lucide-react";

const QUICK_PROMPTS = [
  "Explain why my patch resonates at 2.21 GHz instead of 2.45 GHz",
  "What substrate should I use for 5.8 GHz?",
  "How do I tune a U-slot for 5.5 GHz?",
  "What's the difference between lumped port and wave port?",
];

const RESULT_ANALYZERS = [
  { kind: "s11", label: "S11", icon: Activity },
  { kind: "vswr", label: "VSWR", icon: BarChart3 },
  { kind: "gain", label: "Gain", icon: Radio },
  { kind: "pattern", label: "Pattern", icon: Radio },
  { kind: "current", label: "Current", icon: Activity },
];

export function AivaPanel() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState("chat");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [visionImage, setVisionImage] = useState<string | null>(null);
  const [visionLoading, setVisionLoading] = useState(false);
  const [visionResult, setVisionResult] = useState<string | null>(null);
  const [resultKind, setResultKind] = useState<string>("s11");
  const [resultData, setResultData] = useState({ target: "2.45", actual: "2.43", minS11: "-25", bw: "80", gain: "5.5", eff: "85" });
  const [resultAnalysis, setResultAnalysis] = useState<string | null>(null);
  const [resultLoading, setResultLoading] = useState(false);

  const chat = useApp((s) => s.chat);
  const addMessage = useApp((s) => s.addMessage);
  const projects = useApp((s) => s.projects);
  const activeProjectId = useApp((s) => s.activeProjectId);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const openHandler = () => setOpen(true);
    const sendHandler = () => {
      // Trigger send for any pre-populated messages
      setTimeout(() => doSend(), 50);
    };
    const visionHandler = () => {
      setOpen(true);
      setTab("vision");
    };
    window.addEventListener("aiva-open", openHandler);
    window.addEventListener("aiva-send", sendHandler);
    window.addEventListener("aiva-open-vision", visionHandler);
    return () => {
      window.removeEventListener("aiva-open", openHandler);
      window.removeEventListener("aiva-send", sendHandler);
      window.removeEventListener("aiva-open-vision", visionHandler);
    };
  }, []);

  useEffect(() => {
    if (open && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chat, open]);

  if (!open) return null;

  const project = projects.find((p) => p.id === activeProjectId);
  const projectContext = project
    ? `Project: ${project.name} | Antenna: ${project.antennaType} | Spec: ${project.spec.freq1} GHz${project.spec.freq2 ? ` + ${project.spec.freq2} GHz` : ""} on ${project.spec.substrate} (εᵣ=${project.spec.er}, h=${project.spec.thickness}mm) | Geometry: patch L=${project.geometry.patchLength}mm W=${project.geometry.patchWidth}mm | HFSS step ${project.hfssStep + 1}/17 | Results: ${project.results.length} versions saved`
    : undefined;

  const doSend = async (overrideContent?: string) => {
    const content = overrideContent ?? input;
    if (!content.trim()) return;

    addMessage({
      id: crypto.randomUUID(),
      role: "user",
      content,
      timestamp: Date.now(),
    });
    setInput("");
    setLoading(true);

    try {
      const history = chat
        .filter((m) => m.role !== "system")
        .slice(-6)
        .map((m) => ({ role: m.role, content: m.content }));

      const res = await fetch("/api/aiva/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...history, { role: "user" as const, content }],
          context: projectContext,
        }),
      });
      const data = await res.json();
      addMessage({
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.content || data.error || "Sorry, I couldn't process that. Please retry.",
        timestamp: Date.now(),
      });
    } catch (e) {
      addMessage({
        id: crypto.randomUUID(),
        role: "assistant",
        content: "AIVA is temporarily unavailable. Please retry.",
        timestamp: Date.now(),
      });
    } finally {
      setLoading(false);
    }
  };

  const onFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setVisionImage(dataUrl);
      analyzeVision(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const analyzeVision = async (image: string) => {
    setVisionLoading(true);
    setVisionResult(null);
    try {
      const res = await fetch("/api/aiva/vision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: image,
          stage: project ? `HFSS step ${project.hfssStep + 1}/17` : "general HFSS",
        }),
      });
      const data = await res.json();
      setVisionResult(data.content || data.error || "Vision analysis failed.");
    } catch (e) {
      setVisionResult("Vision analysis unavailable.");
    } finally {
      setVisionLoading(false);
    }
  };

  const analyzeResult = async () => {
    setResultLoading(true);
    setResultAnalysis(null);
    try {
      const res = await fetch("/api/aiva/analyze-result", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: resultKind,
          data: {
            targetFreqGHz: parseFloat(resultData.target),
            simulatedFreqGHz: parseFloat(resultData.actual),
            minS11dB: parseFloat(resultData.minS11),
            bandwidthMHz: parseFloat(resultData.bw),
            gainDBi: parseFloat(resultData.gain),
            efficiency: parseFloat(resultData.eff),
          },
          projectContext,
        }),
      });
      const data = await res.json();
      setResultAnalysis(data.content || "Analysis failed.");
    } catch (e) {
      setResultAnalysis("Result analysis unavailable.");
    } finally {
      setResultLoading(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-background/40 backdrop-blur-sm lg:bg-transparent lg:backdrop-blur-none"
        onClick={() => setOpen(false)}
      />

      {/* Panel */}
      <div className="fixed bottom-0 right-0 sm:bottom-4 sm:right-4 z-50 w-full sm:w-[440px] h-[80vh] sm:h-[600px] max-h-[90vh] bg-card border border-border rounded-t-lg sm:rounded-lg shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-border bg-primary/5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-primary/15 border border-primary/30 flex items-center justify-center">
              <Bot className="w-4 h-4 text-primary" />
            </div>
            <div>
              <div className="text-sm font-semibold">AIVA</div>
              <div className="text-[10px] text-muted-foreground font-mono">
                Antenna Intelligence & Virtual Assistant
              </div>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setOpen(false)}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {project && (
          <div className="px-3 py-2 border-b border-border bg-secondary/30">
            <div className="text-[10px] text-muted-foreground font-mono uppercase">Project context</div>
            <div className="text-xs truncate">{project.name} · {project.spec.freq1} GHz · {project.spec.substrate}</div>
          </div>
        )}

        {/* Tabs */}
        <Tabs value={tab} onValueChange={setTab} className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="grid grid-cols-3 m-2">
            <TabsTrigger value="chat" className="text-xs">
              <MessageSquare className="w-3 h-3 mr-1" /> Chat
            </TabsTrigger>
            <TabsTrigger value="vision" className="text-xs">
              <Eye className="w-3 h-3 mr-1" /> Vision
            </TabsTrigger>
            <TabsTrigger value="results" className="text-xs">
              <BarChart3 className="w-3 h-3 mr-1" /> Results
            </TabsTrigger>
          </TabsList>

          {/* CHAT TAB */}
          <TabsContent value="chat" className="flex-1 flex flex-col overflow-hidden m-0 p-0">
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {chat.length === 0 && (
                <div className="text-center py-4">
                  <Sparkles className="w-8 h-8 text-primary mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground mb-3">
                    Ask about antenna theory, HFSS troubleshooting, or your project.
                  </p>
                  <div className="space-y-1.5">
                    {QUICK_PROMPTS.map((q) => (
                      <button
                        key={q}
                        onClick={() => doSend(q)}
                        className="block w-full text-left text-xs px-2 py-1.5 rounded border border-border bg-card/40 hover:bg-secondary/40"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {chat.map((m) => (
                <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] px-3 py-2 rounded-lg text-xs ${
                      m.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-foreground border border-border"
                    }`}
                  >
                    <pre className="whitespace-pre-wrap font-sans leading-relaxed">{m.content}</pre>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-secondary border border-border px-3 py-2 rounded-lg text-xs flex items-center gap-2">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span className="text-muted-foreground">AIVA is thinking...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            <div className="p-2 border-t border-border flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), doSend())}
                placeholder="Ask AIVA..."
                className="text-xs bg-secondary/40"
                disabled={loading}
              />
              <Button size="icon" onClick={() => doSend()} disabled={loading || !input.trim()}>
                <Send className="w-3.5 h-3.5" />
              </Button>
            </div>
          </TabsContent>

          {/* VISION TAB */}
          <TabsContent value="vision" className="flex-1 overflow-y-auto m-0 p-3 space-y-3">
            <div className="text-xs text-muted-foreground">
              Upload an HFSS screenshot. AIVA identifies geometry, ports, boundaries, plots — and flags possible issues.
            </div>

            {!visionImage ? (
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg p-6 cursor-pointer hover:border-primary/40 hover:bg-secondary/20 transition-colors">
                <ImageIcon className="w-8 h-8 text-muted-foreground mb-2" />
                <span className="text-xs text-muted-foreground">Click to upload HFSS screenshot</span>
                <span className="text-[10px] text-muted-foreground mt-1">PNG / JPG</span>
                <input type="file" accept="image/*" onChange={onFileSelected} className="hidden" />
              </label>
            ) : (
              <>
                <div className="border border-border rounded-lg overflow-hidden">
                  <img src={visionImage} alt="Uploaded HFSS screenshot" className="w-full max-h-48 object-contain bg-secondary/30" />
                </div>
                <Button variant="outline" size="sm" className="w-full" onClick={() => { setVisionImage(null); setVisionResult(null); }}>
                  Upload different screenshot
                </Button>
              </>
            )}

            {visionLoading && (
              <div className="text-xs flex items-center gap-2 p-2 border border-border rounded bg-secondary/30">
                <Loader2 className="w-3 h-3 animate-spin" />
                <span className="text-muted-foreground">AIVA is analyzing the image...</span>
              </div>
            )}

            {visionResult && (
              <div className="border border-primary/30 bg-primary/5 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Eye className="w-3.5 h-3.5 text-primary" />
                  <span className="text-xs font-medium text-primary">AIVA Vision Analysis</span>
                </div>
                <pre className="text-xs whitespace-pre-wrap font-sans leading-relaxed">{visionResult}</pre>
              </div>
            )}

            <div className="text-[10px] text-muted-foreground border-t border-border pt-2">
              <AlertCircle className="w-3 h-3 inline mr-1" />
              AIVA distinguishes "detected visually" from "confirmed by HFSS data". Always verify in HFSS.
            </div>
          </TabsContent>

          {/* RESULTS TAB */}
          <TabsContent value="results" className="flex-1 overflow-y-auto m-0 p-3 space-y-3">
            <div className="text-xs text-muted-foreground">Analyze your simulation results against target spec.</div>

            <div className="grid grid-cols-5 gap-1">
              {RESULT_ANALYZERS.map((r) => (
                <button
                  key={r.kind}
                  onClick={() => setResultKind(r.kind)}
                  className={`flex flex-col items-center gap-1 p-1.5 rounded border text-[10px] ${
                    resultKind === r.kind ? "border-primary bg-primary/10 text-primary" : "border-border bg-card/40 text-muted-foreground"
                  }`}
                >
                  <r.icon className="w-3 h-3" />
                  {r.label}
                </button>
              ))}
            </div>

            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <Field label="Target (GHz)" value={resultData.target} onChange={(v) => setResultData({ ...resultData, target: v })} />
                <Field label="Actual (GHz)" value={resultData.actual} onChange={(v) => setResultData({ ...resultData, actual: v })} />
                <Field label="Min S11 (dB)" value={resultData.minS11} onChange={(v) => setResultData({ ...resultData, minS11: v })} />
                <Field label="Bandwidth (MHz)" value={resultData.bw} onChange={(v) => setResultData({ ...resultData, bw: v })} />
                <Field label="Gain (dBi)" value={resultData.gain} onChange={(v) => setResultData({ ...resultData, gain: v })} />
                <Field label="Efficiency (%)" value={resultData.eff} onChange={(v) => setResultData({ ...resultData, eff: v })} />
              </div>
              <Button size="sm" className="w-full" onClick={analyzeResult} disabled={resultLoading}>
                {resultLoading ? (
                  <><Loader2 className="w-3 h-3 mr-1 animate-spin" /> Analyzing...</>
                ) : (
                  <><BarChart3 className="w-3 h-3 mr-1" /> Analyze with AIVA</>
                )}
              </Button>

              {resultAnalysis && (
                <div className="border border-primary/30 bg-primary/5 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-3.5 h-3.5 text-primary" />
                    <span className="text-xs font-medium text-primary">AIVA Result Analysis</span>
                  </div>
                  <pre className="text-xs whitespace-pre-wrap font-sans leading-relaxed">{resultAnalysis}</pre>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-1">
      <label className="text-[10px] text-muted-foreground uppercase">{label}</label>
      <Input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 text-xs bg-secondary/40 font-mono"
      />
    </div>
  );
}
