import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const outDir = resolve(dirname(fileURLToPath(import.meta.url)), "../public/icons/cloud-islands");

const SKY = {
  official: "#cfe3e0",
  community: "#f0ddb8",
  ended: "#ddd8cd",
};

const MOTIFS = {
  "info-bureau": {
    sky: "official",
    draw: `
      <rect x="78" y="58" width="52" height="46" fill="#fffdf8" stroke="#1a1a1a" stroke-width="2.4"/>
      <rect x="138" y="42" width="44" height="62" fill="#fffdf8" stroke="#1a1a1a" stroke-width="2.4"/>
      <rect x="190" y="66" width="48" height="38" fill="#d4ecdf" stroke="#1a1a1a" stroke-width="2.4"/>
      <rect x="88" y="70" width="10" height="10" fill="#d4e4e3" stroke="#1a1a1a" stroke-width="1.4"/>
      <rect x="108" y="70" width="10" height="10" fill="#d4e4e3" stroke="#1a1a1a" stroke-width="1.4"/>
      <rect x="150" y="54" width="10" height="10" fill="#d4e4e3" stroke="#1a1a1a" stroke-width="1.4"/>
      <rect x="166" y="54" width="10" height="10" fill="#d4e4e3" stroke="#1a1a1a" stroke-width="1.4"/>
      <rect x="150" y="74" width="10" height="10" fill="#d4e4e3" stroke="#1a1a1a" stroke-width="1.4"/>
      <path d="M96 104v16M160 104v16M214 104v16" stroke="#1a1a1a" stroke-width="2.2"/>
    `,
  },
  hanachan: {
    sky: "official",
    draw: `
      <path d="M70 108 L94 70 L118 108Z" fill="#f0d8dc" stroke="#1a1a1a" stroke-width="2.4"/>
      <rect x="80" y="88" width="28" height="20" fill="#fffdf8" stroke="#1a1a1a" stroke-width="2"/>
      <path d="M130 108 L160 58 L190 108Z" fill="#d4e4e3" stroke="#1a1a1a" stroke-width="2.4"/>
      <rect x="144" y="82" width="32" height="26" fill="#fffdf8" stroke="#1a1a1a" stroke-width="2"/>
      <path d="M202 108 L224 74 L246 108Z" fill="#f3e4c8" stroke="#1a1a1a" stroke-width="2.4"/>
      <rect x="212" y="90" width="24" height="18" fill="#fffdf8" stroke="#1a1a1a" stroke-width="2"/>
    `,
  },
  yummyyummy: {
    sky: "official",
    draw: `
      <ellipse cx="118" cy="92" rx="28" ry="18" fill="#f3d4c8" stroke="#1a1a1a" stroke-width="2.4"/>
      <path d="M96 88c8-18 36-18 44 0" fill="none" stroke="#1a1a1a" stroke-width="2.2"/>
      <rect x="168" y="78" width="56" height="34" rx="6" fill="#fffdf8" stroke="#1a1a1a" stroke-width="2.4"/>
      <path d="M176 96h40M176 86h28" stroke="#1a1a1a" stroke-width="2" stroke-linecap="round"/>
      <circle cx="210" cy="70" r="8" fill="#f0c43a" stroke="#1a1a1a" stroke-width="1.8"/>
    `,
  },
  carapichi: {
    sky: "official",
    draw: `
      <circle cx="108" cy="86" r="22" fill="#f3d4e4" stroke="#1a1a1a" stroke-width="2.4"/>
      <circle cx="150" cy="78" r="20" fill="#f3ebc8" stroke="#1a1a1a" stroke-width="2.4"/>
      <circle cx="188" cy="88" r="18" fill="#d4e4f3" stroke="#1a1a1a" stroke-width="2.4"/>
      <circle cx="164" cy="104" r="16" fill="#d9eddf" stroke="#1a1a1a" stroke-width="2.4"/>
      <path d="M108 64c6-14 20-14 26 0" fill="none" stroke="#1a1a1a" stroke-width="2"/>
    `,
  },
  dozle: {
    sky: "official",
    draw: `
      <rect x="70" y="96" width="180" height="16" fill="#7aa0b4" stroke="#1a1a1a" stroke-width="2.2"/>
      <rect x="86" y="70" width="46" height="32" fill="#fffdf8" stroke="#1a1a1a" stroke-width="2.4"/>
      <rect x="188" y="62" width="28" height="40" fill="#e4dcc8" stroke="#1a1a1a" stroke-width="2.4"/>
      <path d="M148 104c18-22 42-22 60 0" fill="none" stroke="#1a1a1a" stroke-width="2.2"/>
      <circle cx="202" cy="78" r="4" fill="#1a1a1a"/>
    `,
  },
  corocoro: {
    sky: "official",
    draw: `
      <rect x="92" y="58" width="54" height="58" fill="#fffdf8" stroke="#1a1a1a" stroke-width="2.4"/>
      <rect x="100" y="68" width="38" height="8" fill="#f0d8dc"/>
      <rect x="100" y="82" width="38" height="6" fill="#e3d9c4"/>
      <rect x="100" y="94" width="28" height="6" fill="#e3d9c4"/>
      <circle cx="198" cy="88" r="24" fill="#f3ebc8" stroke="#1a1a1a" stroke-width="2.4"/>
      <path d="M186 88h24M198 76v24" stroke="#1a1a1a" stroke-width="2.2"/>
    `,
  },
  "pokemonxp-worlds": {
    sky: "official",
    draw: `
      <path d="M70 108 L160 48 L250 108Z" fill="#d4e4f3" stroke="#1a1a1a" stroke-width="2.6"/>
      <rect x="118" y="78" width="84" height="30" fill="#fffdf8" stroke="#1a1a1a" stroke-width="2.2"/>
      <path d="M130 108v-18M190 108v-18" stroke="#1a1a1a" stroke-width="2.2"/>
      <circle cx="160" cy="64" r="7" fill="#f0c43a" stroke="#1a1a1a" stroke-width="1.8"/>
    `,
  },
  ikea: {
    sky: "ended",
    draw: `
      <rect x="88" y="72" width="70" height="40" fill="#fffdf8" stroke="#1a1a1a" stroke-width="2.4"/>
      <rect x="98" y="82" width="22" height="16" fill="#f3e4c8" stroke="#1a1a1a" stroke-width="1.6"/>
      <rect x="128" y="86" width="18" height="12" fill="#d4e4e3" stroke="#1a1a1a" stroke-width="1.6"/>
      <rect x="176" y="64" width="56" height="48" fill="#f3ebc8" stroke="#1a1a1a" stroke-width="2.4"/>
      <path d="M188 112V80h32v32" fill="none" stroke="#1a1a1a" stroke-width="2"/>
    `,
  },
  eiko: {
    sky: "ended",
    draw: `
      <rect x="118" y="42" width="84" height="70" fill="#fffdf8" stroke="#1a1a1a" stroke-width="2.4"/>
      <rect x="136" y="56" width="16" height="16" fill="#d4e4e3" stroke="#1a1a1a" stroke-width="1.5"/>
      <rect x="168" y="56" width="16" height="16" fill="#d4e4e3" stroke="#1a1a1a" stroke-width="1.5"/>
      <rect x="136" y="80" width="16" height="16" fill="#d4e4e3" stroke="#1a1a1a" stroke-width="1.5"/>
      <rect x="168" y="80" width="16" height="16" fill="#d4e4e3" stroke="#1a1a1a" stroke-width="1.5"/>
      <path d="M118 42h84L202 28 160 22 118 28Z" fill="#e4dcd4" stroke="#1a1a1a" stroke-width="2.2"/>
    `,
  },
  sashihara: {
    sky: "ended",
    draw: `
      <rect x="60" y="100" width="200" height="18" fill="#c5d8c8" stroke="#1a1a1a" stroke-width="2"/>
      <path d="M86 100c16-28 40-28 56 0" fill="#d9eddf" stroke="#1a1a1a" stroke-width="2"/>
      <rect x="176" y="70" width="44" height="30" fill="#fffdf8" stroke="#1a1a1a" stroke-width="2.2"/>
      <path d="M176 70h44l-8-12H184Z" fill="#f0d8dc" stroke="#1a1a1a" stroke-width="2"/>
      <circle cx="240" cy="58" r="10" fill="#f0c43a" stroke="#1a1a1a" stroke-width="1.8"/>
    `,
  },
  "rare-items": {
    sky: "community",
    draw: `
      <rect x="86" y="62" width="18" height="18" fill="#f3d4c8" stroke="#1a1a1a" stroke-width="2"/>
      <rect x="110" y="70" width="18" height="18" fill="#d4e4f3" stroke="#1a1a1a" stroke-width="2"/>
      <rect x="98" y="88" width="18" height="18" fill="#d9eddf" stroke="#1a1a1a" stroke-width="2"/>
      <rect x="160" y="58" width="72" height="56" fill="#fffdf8" stroke="#1a1a1a" stroke-width="2.4"/>
      <path d="M172 74h48M172 88h36M172 102h42" stroke="#1a1a1a" stroke-width="2" stroke-linecap="round"/>
    `,
  },
  nenrin: {
    sky: "community",
    draw: `
      <path d="M78 108 L110 68 L142 108Z" fill="#e8efe4" stroke="#1a1a1a" stroke-width="2.4"/>
      <rect x="96" y="86" width="28" height="22" fill="#fffdf8" stroke="#1a1a1a" stroke-width="2"/>
      <path d="M148 108h72v-28H148Z" fill="#f3e4c8" stroke="#1a1a1a" stroke-width="2.2"/>
      <path d="M156 80h56l-8-16H164Z" fill="#8b3a4a" stroke="#1a1a1a" stroke-width="2"/>
      <path d="M200 52c18-6 36 8 28 22-16 4-28-6-28-22Z" fill="#d4e4f3" stroke="#1a1a1a" stroke-width="2"/>
    `,
  },
  "horsea-aqua": {
    sky: "community",
    draw: `
      <rect x="78" y="56" width="164" height="62" fill="#c9dce8" stroke="#1a1a1a" stroke-width="2.6"/>
      <path d="M92 104c12-16 24-8 36-18s22-2 34-12" fill="none" stroke="#2f5f5e" stroke-width="2"/>
      <circle cx="190" cy="78" r="10" fill="#7aa0b4" stroke="#1a1a1a" stroke-width="1.8"/>
      <path d="M118 88c6 8 16 8 22 0" fill="none" stroke="#1a1a1a" stroke-width="1.8"/>
      <rect x="78" y="56" width="164" height="10" fill="#fffdf8" stroke="#1a1a1a" stroke-width="2"/>
    `,
  },
  signboard: {
    sky: "community",
    draw: `
      <rect x="92" y="54" width="64" height="36" fill="#fffdf8" stroke="#1a1a1a" stroke-width="2.4"/>
      <path d="M124 90v22" stroke="#1a1a1a" stroke-width="2.6"/>
      <rect x="168" y="64" width="56" height="28" fill="#f3ebc8" stroke="#1a1a1a" stroke-width="2.4"/>
      <path d="M196 92v20" stroke="#1a1a1a" stroke-width="2.6"/>
      <path d="M102 66h44M176 74h40" stroke="#1a1a1a" stroke-width="2" stroke-linecap="round"/>
    `,
  },
  pokonlyup: {
    sky: "community",
    draw: `
      <path d="M70 112 L118 78 L150 96 L190 52 L250 112Z" fill="#e4dcc8" stroke="#1a1a1a" stroke-width="2.6"/>
      <path d="M118 78 L132 90 L150 96" fill="none" stroke="#8b3a4a" stroke-width="2.4"/>
      <circle cx="190" cy="52" r="5" fill="#8b3a4a"/>
      <path d="M86 70c10-8 18-2 16 8" fill="none" stroke="#1a1a1a" stroke-width="1.8"/>
    `,
  },
  popo: {
    sky: "community",
    draw: `
      <rect x="118" y="64" width="84" height="48" fill="#fffdf8" stroke="#1a1a1a" stroke-width="2.4"/>
      <rect x="96" y="80" width="22" height="32" fill="#f3e4c8" stroke="#1a1a1a" stroke-width="2"/>
      <rect x="202" y="80" width="22" height="32" fill="#f3e4c8" stroke="#1a1a1a" stroke-width="2"/>
      <path d="M118 64h84L202 46 160 36 118 46Z" fill="#d4e4e3" stroke="#1a1a1a" stroke-width="2.2"/>
      <rect x="150" y="86" width="20" height="26" fill="#e3d9c4" stroke="#1a1a1a" stroke-width="1.8"/>
    `,
  },
  "item-comp": {
    sky: "community",
    draw: `
      <rect x="86" y="70" width="28" height="28" fill="#d9eddf" stroke="#1a1a1a" stroke-width="2"/>
      <rect x="120" y="78" width="28" height="20" fill="#f3d4c8" stroke="#1a1a1a" stroke-width="2"/>
      <rect x="154" y="66" width="28" height="32" fill="#d4e4f3" stroke="#1a1a1a" stroke-width="2"/>
      <rect x="188" y="74" width="28" height="24" fill="#f3ebc8" stroke="#1a1a1a" stroke-width="2"/>
      <path d="M100 64v6M134 70v8M168 58v8M202 66v8" stroke="#1a1a1a" stroke-width="2"/>
    `,
  },
  "rocket-warehouse": {
    sky: "community",
    draw: `
      <rect x="88" y="58" width="144" height="58" fill="#e4e0d6" stroke="#1a1a1a" stroke-width="2.6"/>
      <rect x="104" y="72" width="24" height="18" fill="#4d4d4d"/>
      <rect x="148" y="72" width="24" height="18" fill="#4d4d4d"/>
      <rect x="192" y="72" width="24" height="18" fill="#4d4d4d"/>
      <rect x="148" y="94" width="24" height="22" fill="#fffdf8" stroke="#1a1a1a" stroke-width="2"/>
      <path d="M160 48v10" stroke="#1a1a1a" stroke-width="2.2"/>
    `,
  },
  "mixed-build": {
    sky: "community",
    draw: `
      <rect x="78" y="78" width="36" height="34" fill="#fffdf8" stroke="#1a1a1a" stroke-width="2.2"/>
      <path d="M130 112 L154 64 L178 112Z" fill="#f0d8dc" stroke="#1a1a1a" stroke-width="2.2"/>
      <rect x="186" y="70" width="28" height="42" fill="#d4e4e3" stroke="#1a1a1a" stroke-width="2.2"/>
      <rect x="220" y="84" width="24" height="28" fill="#f3e4c8" stroke="#1a1a1a" stroke-width="2.2"/>
      <circle cx="200" cy="82" r="4" fill="#1a1a1a"/>
    `,
  },
};

function svgFor(id, motif) {
  const sky = SKY[motif.sky];
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 180" role="img" aria-hidden="true">
  <title>本站雲島示意</title>
  <rect width="320" height="180" fill="${sky}"/>
  <ellipse cx="54" cy="38" rx="22" ry="10" fill="#fffdf8" stroke="#1a1a1a" stroke-width="1.8"/>
  <ellipse cx="72" cy="42" rx="14" ry="8" fill="#fffdf8" stroke="#1a1a1a" stroke-width="1.6"/>
  <ellipse cx="250" cy="34" rx="20" ry="9" fill="#fffdf8" stroke="#1a1a1a" stroke-width="1.8"/>
  <ellipse cx="160" cy="138" rx="128" ry="30" fill="#e8dcc4" stroke="#1a1a1a" stroke-width="2.6"/>
  <ellipse cx="160" cy="150" rx="108" ry="14" fill="#c9b89a" opacity="0.55"/>
  ${motif.draw}
  <rect x="2" y="2" width="316" height="176" fill="none" stroke="#1a1a1a" stroke-width="3"/>
</svg>
`;
}

await mkdir(outDir, { recursive: true });
for (const [id, motif] of Object.entries(MOTIFS)) {
  await writeFile(resolve(outDir, `${id}.svg`), svgFor(id, motif));
}
console.log(`wrote ${Object.keys(MOTIFS).length} cloud-island previews`);
