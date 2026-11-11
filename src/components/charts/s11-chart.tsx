"use client";

import { generateS11Curve } from "@/lib/antenna-calc";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, ReferenceLine, Tooltip, Area, ComposedChart,
} from "recharts";

interface S11ChartProps {
  targetFreq: number; // GHz
  detunePct: number; // percentage detune
  minS11: number; // dB
  specMinS11: number; // dB (negative)
}

export function S11Chart({ targetFreq, detunePct, minS11, specMinS11 }: S11ChartProps) {
  const data = generateS11Curve(targetFreq, detunePct, minS11, 35);

  const chartData = data.freq.map((f, i) => ({
    freq: f,
    s11: data.s11[i],
  }));

  const resonanceMHz = data.resonanceMHz;
  const bwMHz = data.bandwidthMHz;

  return (
    <div>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
            <defs>
              <linearGradient id="s11Fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="oklch(0.65 0.18 145)" stopOpacity={0.4} />
                <stop offset="100%" stopColor="oklch(0.65 0.18 145)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="2 3" stroke="oklch(0.3 0 0)" strokeOpacity={0.3} />
            <XAxis
              dataKey="freq"
              type="number"
              domain={["dataMin", "dataMax"]}
              tickFormatter={(v) => `${v.toFixed(2)}`}
              stroke="oklch(0.5 0 0)"
              tick={{ fill: "oklch(0.6 0 0)", fontSize: 10, fontFamily: "monospace" }}
              label={{ value: "Frequency (GHz)", position: "insideBottom", offset: -10, fill: "oklch(0.6 0 0)", fontSize: 11 }}
            />
            <YAxis
              domain={[-40, 0]}
              tickFormatter={(v) => `${v}`}
              stroke="oklch(0.5 0 0)"
              tick={{ fill: "oklch(0.6 0 0)", fontSize: 10, fontFamily: "monospace" }}
              label={{ value: "S11 (dB)", angle: -90, position: "insideLeft", fill: "oklch(0.6 0 0)", fontSize: 11 }}
            />
            <Tooltip
              contentStyle={{
                background: "oklch(0.15 0.005 230)",
                border: "1px solid oklch(0.3 0 0)",
                borderRadius: "6px",
                fontSize: "11px",
                fontFamily: "monospace",
              }}
              labelStyle={{ color: "oklch(0.7 0 0)" }}
              formatter={(v: any) => [`${Number(v).toFixed(2)} dB`, "S11"]}
              labelFormatter={(v: any) => `${Number(v).toFixed(3)} GHz`}
            />
            <ReferenceLine
              y={specMinS11}
              stroke="oklch(0.78 0.16 80)"
              strokeDasharray="4 2"
              label={{
                value: `Spec ${specMinS11} dB`,
                position: "insideTopRight",
                fill: "oklch(0.78 0.16 80)",
                fontSize: 10,
                fontFamily: "monospace",
              }}
            />
            <ReferenceLine
              x={targetFreq}
              stroke="oklch(0.65 0.18 145)"
              strokeDasharray="3 3"
              strokeOpacity={0.5}
              label={{
                value: `Target ${targetFreq} GHz`,
                position: "top",
                fill: "oklch(0.65 0.18 145)",
                fontSize: 10,
                fontFamily: "monospace",
              }}
            />
            <Area
              type="monotone"
              dataKey="s11"
              stroke="oklch(0.65 0.18 145)"
              strokeWidth={2}
              fill="url(#s11Fill)"
              isAnimationActive={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 text-xs">
        <Metric label="Resonance" value={`${(resonanceMHz / 1000).toFixed(3)} GHz`} />
        <Metric label="Min S11" value={`${data.minS11dB.toFixed(1)} dB`} />
        <Metric label="Bandwidth" value={`${bwMHz.toFixed(0)} MHz`} status={bwMHz >= 80 ? "pass" : "warn"} />
        <Metric label="Q factor" value={`${(resonanceMHz / Math.max(1, bwMHz)).toFixed(0)}`} />
      </div>
    </div>
  );
}

function Metric({ label, value, status }: { label: string; value: string; status?: "pass" | "warn" }) {
  return (
    <div className="p-2 rounded border border-border bg-card/40">
      <div className="text-[10px] text-muted-foreground uppercase">{label}</div>
      <div className={`font-mono ${status === "pass" ? "text-pass" : status === "warn" ? "text-warn" : "text-foreground"}`}>{value}</div>
    </div>
  );
}
