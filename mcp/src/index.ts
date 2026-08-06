#!/usr/bin/env node
/**
 * Chhandas MCP Server
 *
 * Exposes Nepali/Sanskrit poetic-meter analysis as MCP tools so that
 * Claude (and other MCP-compatible clients) can analyse verses, list
 * known meters, and look up detailed meter information.
 *
 * Tools:
 *   analyze_meter      – full stanza / line analysis (meter + syllables)
 *   detect_syllables   – break a line into syllables showing S (guru) / I (laghu)
 *   list_meters        – enumerate all supported meters
 *   get_meter_info     – detailed info for one named meter
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

import { processStanza, detectSyllables, splitAksharas } from "@chhandas/core";
import { CHHANDAS, CHHANDAS_INFO, GANAS } from "@chhandas/core";

// ─── Server setup ─────────────────────────────────────────────────────────────
const server = new Server(
  { name: "chhandas-mcp", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

// ─── Tool definitions ─────────────────────────────────────────────────────────
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "analyze_meter",
      description:
        "Analyse a Nepali or Sanskrit verse/stanza and detect its poetic meter (chhandas). " +
        "Pass one or more lines separated by newlines. Returns the detected meter for each " +
        "line, the overall meter if all lines match, syllable weights (S=guru, I=laghu), " +
        "gana groupings, and Anustubh analysis when the text looks like a shloka.",
      inputSchema: {
        type: "object",
        properties: {
          text: {
            type: "string",
            description:
              "The verse text in Devanagari. Multiple lines separated by \\n.",
          },
        },
        required: ["text"],
      },
    },
    {
      name: "detect_syllables",
      description:
        "Split a single line of Devanagari text into aksharas (syllable units) and " +
        "classify each as S (Guru/heavy/long) or I (Laghu/light/short). " +
        "Useful for understanding how a line scans before checking against a meter.",
      inputSchema: {
        type: "object",
        properties: {
          text: {
            type: "string",
            description: "A single line of Devanagari verse.",
          },
        },
        required: ["text"],
      },
    },
    {
      name: "list_meters",
      description:
        "List all poetic meters (chhandas) supported by this tool, with their " +
        "gana patterns, syllable counts, and classification.",
      inputSchema: {
        type: "object",
        properties: {
          classification: {
            type: "string",
            enum: ["all", "Vṛtta", "Mātrā-vṛtta"],
            description:
              "Filter by classification. Defaults to 'all'.",
          },
        },
        required: [],
      },
    },
    {
      name: "get_meter_info",
      description:
        "Get detailed information about a specific meter by name (in Nepali/Devanagari " +
        "or romanised spelling). Includes pattern, gana names, syllable count, and description.",
      inputSchema: {
        type: "object",
        properties: {
          name: {
            type: "string",
            description:
              "Name of the meter, e.g. 'वसन्ततिलका' or 'vasantatilaka'.",
          },
        },
        required: ["name"],
      },
    },
  ],
}));

// ─── Tool handlers ────────────────────────────────────────────────────────────
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    // ── analyze_meter ────────────────────────────────────────────────────────
    case "analyze_meter": {
      const text = (args as { text: string }).text;
      if (!text?.trim()) {
        return {
          content: [{ type: "text", text: "Error: 'text' must not be empty." }],
          isError: true,
        };
      }

      const { results, overallChhanda, anustubhResult } = processStanza(text);

      const lines = results.map((r) => {
        const syllableStr = r.syllables.join(" ");
        const aksharaLabels = r.aksharas
          .map((a, i) => {
            const sIdx = r.aksharaToSyllableMap[i];
            const weight = sIdx !== null && sIdx !== undefined ? r.syllables[sIdx] : "·";
            return `${a}(${weight})`;
          })
          .join(" ");

        const ganaNames = r.ganaSeq
          .map((g) => `${g}[${GANAS[g] ?? "?"}]`)
          .join(" ");

        return [
          `Line: ${r.line}`,
          `  Aksharas: ${aksharaLabels}`,
          `  Syllables: ${syllableStr}  (count: ${r.syllables.length})`,
          `  Ganas: ${ganaNames || "(none)"}`,
          `  Detected meter: ${r.chhanda ?? "not recognised"}`,
        ].join("\n");
      });

      const sections: string[] = [
        "=== Chhandas Analysis ===",
        "",
        lines.join("\n\n"),
        "",
        `Overall meter: ${overallChhanda ?? "mixed / unrecognised"}`,
      ];

      // Include Anustubh analysis when relevant
      if (
        anustubhResult.isAnustubh ||
        (anustubhResult.totalSyllables >= 28 && anustubhResult.totalSyllables <= 36)
      ) {
        sections.push("");
        sections.push("--- Anustubh (Shloka) Analysis ---");
        sections.push(`  Result: ${anustubhResult.isAnustubh ? "✓ IS Anustubh" : "✗ NOT Anustubh"}`);
        sections.push(`  Confidence: ${anustubhResult.confidence}%`);
        sections.push(`  Total syllables: ${anustubhResult.totalSyllables} (expected 32)`);
        sections.push(`  Input format: ${anustubhResult.inputFormat}`);

        if (anustubhResult.overallErrors.length > 0) {
          sections.push("  Issues:");
          anustubhResult.overallErrors.forEach((e) => sections.push(`    • ${e}`));
        }

        anustubhResult.padaAnalysis.forEach((pada, i) => {
          sections.push(
            `  Pada ${i + 1} (${pada.isEvenPada ? "even" : "odd"}): ` +
              `${pada.syllables.join("")}  [${pada.syllableCount} syllables]  ` +
              (pada.followsPattern ? "✓" : "✗")
          );
        });
      }

      return { content: [{ type: "text", text: sections.join("\n") }] };
    }

    // ── detect_syllables ─────────────────────────────────────────────────────
    case "detect_syllables": {
      const text = (args as { text: string }).text;
      if (!text?.trim()) {
        return {
          content: [{ type: "text", text: "Error: 'text' must not be empty." }],
          isError: true,
        };
      }

      const syllables = detectSyllables(text.trim());
      const aksharas = splitAksharas(text.trim().normalize("NFC"));

      // Pair each akshara with its weight
      let syllableIdx = 0;
      const pairs: string[] = aksharas.map((a) => {
        // Determine if this akshara has a syllable (pure closing consonants don't)
        const isPureClosed =
          a.endsWith("\u094D") &&
          !Array.from(a).some(
            (c) =>
              "\u093E\u0940\u0942\u0947\u0948\u094B\u094C\u0962\u0963\u093F\u0941\u0943".includes(c)
          ) &&
          /[\u0915-\u0939\u0958-\u095F]/u.test(a[0]);

        if (isPureClosed) return `${a}(·)`;
        const w = syllables[syllableIdx++] ?? "?";
        return `${a}(${w})`;
      });

      const pattern = syllables.join(" ");
      const gurCount = syllables.filter((s) => s === "S").length;
      const lagCount = syllables.filter((s) => s === "I").length;

      return {
        content: [
          {
            type: "text",
            text: [
              `Input: ${text.trim()}`,
              `Breakdown: ${pairs.join("  ")}`,
              `Pattern:   ${pattern}`,
              `Total syllables: ${syllables.length}  (S/Guru: ${gurCount}, I/Laghu: ${lagCount})`,
              "",
              "Legend: S = Guru (heavy/long)  I = Laghu (light/short)  · = closing consonant (no syllable)",
            ].join("\n"),
          },
        ],
      };
    }

    // ── list_meters ──────────────────────────────────────────────────────────
    case "list_meters": {
      const filter =
        ((args as Record<string, string> | undefined)?.classification ?? "all");

      const rows: string[] = [
        "Meter (Devanagari)    Pattern                              Syllables  Classification",
        "─".repeat(90),
      ];

      for (const [meter, pattern] of Object.entries(CHHANDAS)) {
        const info = CHHANDAS_INFO[meter];
        const cls = info?.classification ?? "Vṛtta";

        if (filter !== "all" && cls !== filter) continue;

        const patternStr =
          pattern.length > 0
            ? pattern.join(" ")
            : "(special rules)";

        const syllCount =
          pattern.length > 0
            ? pattern.join("").replace(/-/g, "").length
            : info?.syllablesPerLine ?? "–";

        rows.push(
          `${meter.padEnd(22)}${patternStr.padEnd(40)}${String(syllCount).padEnd(10)}${cls}`
        );
      }

      rows.push("");
      rows.push("Legend: S = Guru (heavy), I = Laghu (light)");

      return { content: [{ type: "text", text: rows.join("\n") }] };
    }

    // ── get_meter_info ───────────────────────────────────────────────────────
    case "get_meter_info": {
      const query = ((args as { name: string }).name ?? "").trim();

      // Try exact Devanagari match first, then case-insensitive romanised fuzzy match
      let found: string | undefined = Object.keys(CHHANDAS).find(
        (k) => k === query
      );

      if (!found) {
        const lower = query.toLowerCase();
        found = Object.keys(CHHANDAS).find((k) =>
          k.toLowerCase().includes(lower)
        );
      }

      if (!found) {
        return {
          content: [
            {
              type: "text",
              text:
                `Meter '${query}' not found.\n` +
                `Available meters: ${Object.keys(CHHANDAS).join(", ")}`,
            },
          ],
          isError: true,
        };
      }

      const pattern = CHHANDAS[found];
      const info = CHHANDAS_INFO[found];

      const ganaDetail =
        pattern.length > 0
          ? pattern
              .map((g) => {
                const clean = g.replace(/-/g, "");
                return `  ${clean}  →  ${GANAS[clean] ?? "partial"}`;
              })
              .join("\n")
          : "  (governed by special positional rules)";

      const syllCount =
        pattern.length > 0
          ? pattern.join("").replace(/-/g, "").length
          : info?.syllablesPerLine ?? "variable";

      const lines = [
        `Meter: ${found}`,
        `Classification: ${info?.classification ?? "Vṛtta"}`,
        `Syllables per pada: ${syllCount}`,
        `Full pattern: ${pattern.length > 0 ? pattern.join(" ") : "(special)"}`,
        "",
        "Gana breakdown:",
        ganaDetail,
        "",
        `Description: ${info?.description ?? "No description available."}`,
      ];

      return { content: [{ type: "text", text: lines.join("\n") }] };
    }

    // ── unknown ──────────────────────────────────────────────────────────────
    default:
      return {
        content: [{ type: "text", text: `Unknown tool: ${name}` }],
        isError: true,
      };
  }
});

// ─── Start server ─────────────────────────────────────────────────────────────
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  // Intentionally no console.log here – stdout is reserved for MCP protocol JSON
  process.stderr.write("Chhandas MCP server running on stdio\n");
}

main().catch((err) => {
  process.stderr.write(`Fatal: ${err}\n`);
  process.exit(1);
});
