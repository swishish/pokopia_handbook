#!/usr/bin/env node
/**
 * Replace identification sprites with PokeAPI HOME renders,
 * resized locally to 256px WebP. Does not hotlink at runtime.
 */
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { mkdir, readFile, writeFile, unlink, readdir } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const exec = promisify(execFile);
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const imgDir = resolve(root, "public/pokedex");
const rawDir = "/tmp/pokedex-home";
const jsonPath = resolve(root, "src/data/pokedex.json");
const gapPath = resolve(root, "src/data/pokedex-art.md");

await mkdir(imgDir, { recursive: true });
await mkdir(rawDir, { recursive: true });

const pokedex = JSON.parse(await readFile(jsonPath, "utf8"));
const ids = [...new Set(pokedex.species.map((s) => s.pokemon_id))];
const nationalByPokemon = new Map(pokedex.species.map((s) => [s.pokemon_id, s.national_id]));

function homeUrl(id) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${id}.png`;
}

async function download(url, dest) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  await writeFile(dest, Buffer.from(await res.arrayBuffer()));
}

async function toWebp(src, dest) {
  await exec("ffmpeg", [
    "-y",
    "-i",
    src,
    "-vf",
    "scale=256:256:force_original_aspect_ratio=decrease:flags=lanczos,pad=256:256:(ow-iw)/2:(oh-ih)/2:color=0x00000000",
    "-c:v",
    "libwebp",
    "-quality",
    "78",
    "-compression_level",
    "5",
    dest,
  ]);
}

const gaps = [];
const CONCURRENCY = 8;
let index = 0;
let ok = 0;
let skipped = 0;

async function worker() {
  while (index < ids.length) {
    const current = index;
    index += 1;
    const id = ids[current];
    const dest = resolve(imgDir, `${id}.webp`);
    try {
      await readFile(dest);
      skipped += 1;
      continue;
    } catch {
      // download
    }
    const candidates = [id];
    const national = nationalByPokemon.get(id);
    if (national && national !== id) candidates.push(national);
    let got = false;
    for (const candidate of candidates) {
      const raw = resolve(rawDir, `${candidate}.png`);
      try {
        try {
          await readFile(raw);
        } catch {
          await download(homeUrl(candidate), raw);
        }
        await toWebp(raw, dest);
        ok += 1;
        got = true;
        if (current % 20 === 0) console.log(`HOME ${current}/${ids.length} id=${id}`);
        break;
      } catch {
        // try fallback id
      }
    }
    if (!got) gaps.push(id);
  }
}

console.log(`HOME 轉換：${ids.length} 個 pokemon_id`);
await Promise.all(Array.from({ length: CONCURRENCY }, () => worker()));
console.log(`完成 ${ok}，已存在略過 ${skipped}，缺圖 ${gaps.length}`);

for (const entry of pokedex.species) {
  entry.image = `/pokedex/${entry.pokemon_id}.webp`;
  entry.image_source = homeUrl(entry.pokemon_id);
  entry.image_attr_tc = "PokeAPI Pokémon HOME 渲染圖（識別用，已於本地縮成 WebP）";
}

pokedex.note_tc =
  "種族中文取自台灣官方圖鑑用語（PokeAPI zh-Hant／台灣寶可夢官方網站圖鑑）。口味、棲息與喜好類來自社群表（PokopiaPlanning／Serebii），信心標為社群彙整。卡片圖為 PokeAPI HOME 渲染縮圖。";
pokedex.habitats = [
  { id: "bright", name_tc: "明亮" },
  { id: "humid", name_tc: "潮濕" },
  { id: "dark", name_tc: "陰暗" },
  { id: "warm", name_tc: "溫暖" },
  { id: "dry", name_tc: "乾燥" },
  { id: "cool", name_tc: "涼爽" },
];
const homeSource = {
  name: "PokeAPI Pokémon HOME sprites",
  url: "https://github.com/PokeAPI/sprites",
};
if (!pokedex.sources.some((s) => s.url === homeSource.url)) pokedex.sources.push(homeSource);
const typeSource = {
  name: "partywhale/pokemon-type-icons（MIT）",
  url: "https://github.com/partywhale/pokemon-type-icons",
};
if (!pokedex.sources.some((s) => s.url === typeSource.url)) pokedex.sources.push(typeSource);

await writeFile(jsonPath, `${JSON.stringify(pokedex, null, 2)}\n`);

const pngs = (await readdir(imgDir)).filter((name) => name.endsWith(".png"));
for (const name of pngs) await unlink(resolve(imgDir, name));
console.log(`刪除舊 PNG ${pngs.length} 張`);

await writeFile(
  gapPath,
  `# 圖鑑美術來源

- 種族卡片圖：PokeAPI \`sprites/pokemon/other/home/{id}.png\`，本地縮成 256px WebP。
- 屬性圖示：\`partywhale/pokemon-type-icons\`（MIT，vendored 於 \`public/icons/types/\`）。
- 口味／棲息圖示：本站自繪圓形小標，非轉自 Pokopia Companion。
- 缺 HOME 圖的 pokemon_id：${gaps.length ? gaps.join(", ") : "無"}
`,
);
if (gaps.length) console.error("缺 HOME 圖", gaps.join(", "));
