/**
 * Deep Unlighthouse -> Markdown extractor
 *
 * Usage:
 * node deep-unlighthouse-report.js ./.unlighthouse ./UNLIGHTHOUSE_DETAILED.md
 *
 * Purpose:
 * Extracts highly detailed actionable Lighthouse/Unlighthouse findings:
 * - exact elements / selectors
 * - problematic images
 * - JS / CSS files causing bloat
 * - LCP element
 * - CLS shifting elements
 * - render blocking resources
 * - unused CSS / JS
 * - network payloads
 * - accessibility failing nodes
 * - SEO failures
 */

const fs = require("fs");
const path = require("path");

const inputDir = process.argv[2] || "./.unlighthouse";
const outputFile = process.argv[3] || "./UNLIGHTHOUSE_DETAILED.md";

function walk(dir) {
  let out = [];
  for (const item of fs.readdirSync(dir)) {
    const full = path.join(dir, item);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

function readJSON(file) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return null;
  }
}

function fmtScore(v) {
  return v == null ? "-" : Math.round(v * 100);
}

function rows(audit) {
  return audit?.details?.items || [];
}

function val(v) {
  if (v == null) return "";
  if (typeof v === "string") return v;
  return JSON.stringify(v);
}

function extractNode(item) {
  return (
    item?.node?.selector ||
    item?.node?.snippet ||
    item?.node?.path ||
    item?.selector ||
    item?.snippet ||
    item?.url ||
    ""
  );
}

function addSection(md, title) {
  return md + `\n## ${title}\n\n`;
}

function pageHeader(url) {
  return `\n---\n# ${url}\n\n`;
}

function auditLine(title, text) {
  return `- **${title}**: ${text}\n`;
}

function processReport(json) {
  const audits = json.audits || {};
  const cats = json.categories || {};
  const url = json.finalUrl || json.requestedUrl || "Unknown Page";

  let md = pageHeader(url);

  md += `## Scores\n`;
  md += `- Performance: ${fmtScore(cats.performance?.score)}\n`;
  md += `- Accessibility: ${fmtScore(cats.accessibility?.score)}\n`;
  md += `- Best Practices: ${fmtScore(cats["best-practices"]?.score)}\n`;
  md += `- SEO: ${fmtScore(cats.seo?.score)}\n\n`;

  md += `## Core Web Vitals\n`;
  md += auditLine("FCP", audits["first-contentful-paint"]?.displayValue || "-");
  md += auditLine("LCP", audits["largest-contentful-paint"]?.displayValue || "-");
  md += auditLine("CLS", audits["cumulative-layout-shift"]?.displayValue || "-");
  md += auditLine("TBT", audits["total-blocking-time"]?.displayValue || "-");
  md += auditLine("Speed Index", audits["speed-index"]?.displayValue || "-");

  /**
   * LCP Element
   */
  if (audits["largest-contentful-paint-element"]) {
    md = addSection(md, "Largest Contentful Paint Element");
    rows(audits["largest-contentful-paint-element"]).forEach((r) => {
      md += `- Element: \`${extractNode(r)}\`\n`;
    });
  }

  /**
   * CLS elements
   */
  if (audits["layout-shift-elements"]) {
    md = addSection(md, "Layout Shifting Elements (CLS)");
    rows(audits["layout-shift-elements"]).forEach((r) => {
      md += `- Shifting Element: \`${extractNode(r)}\`\n`;
    });
  }

  /**
   * Image issues
   */
  [
    "uses-optimized-images",
    "modern-image-formats",
    "offscreen-images",
    "uses-responsive-images",
    "efficient-animated-content"
  ].forEach((key) => {
    if (audits[key]) {
      md = addSection(md, audits[key].title);

      rows(audits[key]).forEach((r) => {
        md += `- Image: ${r.url || extractNode(r)}\n`;
        if (r.wastedBytes) md += `  - Potential Saving: ${r.wastedBytes} bytes\n`;
      });
    }
  });

  /**
   * JS / CSS waste
   */
  ["unused-javascript", "unused-css-rules"].forEach((key) => {
    if (audits[key]) {
      md = addSection(md, audits[key].title);

      rows(audits[key]).forEach((r) => {
        md += `- File: ${r.url}\n`;
        if (r.wastedBytes) md += `  - Unused Bytes: ${r.wastedBytes}\n`;
        if (r.totalBytes) md += `  - Total Bytes: ${r.totalBytes}\n`;
      });
    }
  });

  /**
   * Render blocking
   */
  if (audits["render-blocking-resources"]) {
    md = addSection(md, "Render Blocking Resources");

    rows(audits["render-blocking-resources"]).forEach((r) => {
      md += `- Resource: ${r.url}\n`;
      if (r.wastedMs) md += `  - Blocking Time: ${r.wastedMs} ms\n`;
    });
  }

  /**
   * Heavy network payloads
   */
  if (audits["network-requests"]) {
    md = addSection(md, "Largest Network Requests");

    rows(audits["network-requests"])
      .sort((a, b) => (b.transferSize || 0) - (a.transferSize || 0))
      .slice(0, 15)
      .forEach((r) => {
        md += `- ${r.url}\n`;
        md += `  - Size: ${r.transferSize || 0} bytes\n`;
        md += `  - Type: ${r.resourceType || "-"}\n`;
      });
  }

  /**
   * Accessibility issues
   */
  Object.keys(audits).forEach((k) => {
    const a = audits[k];

    if (
      a.score !== 1 &&
      a.scoreDisplayMode !== "notApplicable" &&
      cats.accessibility?.auditRefs?.some((x) => x.id === k)
    ) {
      md = addSection(md, `Accessibility: ${a.title}`);

      rows(a).forEach((r) => {
        md += `- Element: \`${extractNode(r)}\`\n`;
      });

      md += `- ${a.description}\n`;
    }
  });

  /**
   * SEO issues
   */
  Object.keys(audits).forEach((k) => {
    const a = audits[k];

    if (
      a.score !== 1 &&
      a.scoreDisplayMode !== "notApplicable" &&
      cats.seo?.auditRefs?.some((x) => x.id === k)
    ) {
      md = addSection(md, `SEO: ${a.title}`);
      md += `- ${a.description}\n`;
    }
  });

  return md;
}

function main() {
  const files = walk(inputDir).filter((f) => f.endsWith(".json"));

  let md = `# Deep Unlighthouse Actionable Report\n\nGenerated: ${new Date().toISOString()}\n`;

  for (const file of files) {
    const json = readJSON(file);
    if (json?.audits) {
      md += processReport(json);
    }
  }

  md += `\n---\n# AI Prompt\n`;
  md += `
Analyze this report and give exact fixes for:
1. Which React components likely cause LCP
2. Which images should be compressed / lazy loaded
3. Which CSS files should be split
4. Which JS bundles should be code-split
5. CLS fixes for listed selectors
6. Route wise performance roadmap
`;

  fs.writeFileSync(outputFile, md);
  console.log("Detailed report created:", outputFile);
}

main();