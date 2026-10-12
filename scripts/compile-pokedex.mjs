import { createWriteStream } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const rawDir = resolve(root, "scripts/raw");
const imgDir = resolve(root, "public/pokedex");

const NAME_OVERRIDES = {
  "Farfetch'd": "farfetchd",
  "Mr. Mime": "mr-mime",
  "Mime Jr.": "mime-jr",
  "Paldean Wooper": "wooper-paldea",
  "Tatsugiri Curly Form": "tatsugiri-curly",
  "Tatsugiri Droopy Form": "tatsugiri-droopy",
  "Tatsugiri Stretchy Form": "tatsugiri-stretchy",
  "Toxtricity Amped Form": "toxtricity-amped",
  "Toxtricity Low Key Form": "toxtricity-low-key",
  "Porygon-Z": "porygon-z",
  "Ho-Oh": "ho-oh",
  "Frillish Male Form": "frillish-male",
  "Frillish Female Form": "frillish-male",
  "Jellicent Male Form": "jellicent-male",
  "Jellicent Female Form": "jellicent-male",
  "Mimikyu": "mimikyu-disguised",
  "Shellos East Sea": "shellos",
  "Gastrodon East Sea": "gastrodon",
  "Professor Tangrowth": "tangrowth",
  "Peakychu": "pikachu",
  "Mosslax": "snorlax",
  "Stereo Rotom": "rotom",
  "Flabébé": "flabebe",
  "Flabebe": "flabebe",
  "Type: Null": "type-null",
  "Jangmo-o": "jangmo-o",
  "Hakamo-o": "hakamo-o",
  "Kommo-o": "kommo-o",
  "Nidoran♀": "nidoran-f",
  "Nidoran♂": "nidoran-m",
  "Nidoran F": "nidoran-f",
  "Nidoran M": "nidoran-m",
  "Sirfetch'd": "sirfetchd",
  "Farfetchd": "farfetchd",
};

const UNIQUE_NPC = new Set([
  "Professor Tangrowth",
  "Peakychu",
  "Mosslax",
  "Stereo Rotom",
]);

const FORM_TC = {
  "Paldean Wooper": "帕底亞的樣子",
  "Tatsugiri Curly Form": "彎彎的樣子",
  "Tatsugiri Droopy Form": "下垂的樣子",
  "Tatsugiri Stretchy Form": "拉伸的樣子",
  "Toxtricity Amped Form": "高昂姿勢",
  "Toxtricity Low Key Form": "低調姿勢",
  "Frillish Male Form": "雄",
  "Frillish Female Form": "雌",
  "Jellicent Male Form": "雄",
  "Jellicent Female Form": "雌",
  "Shellos East Sea": "東海的樣子",
  "Gastrodon East Sea": "東海的樣子",
  "Professor Tangrowth": "博士",
  "Peakychu": "尖峰",
  "Mosslax": "青苔",
  "Stereo Rotom": "音響",
  "Mimikyu": "",
};

const FLAVOR_MAP = {
  "sweet flavors": { id: "sweet", name_tc: "甜甜的" },
  "sour flavors": { id: "sour", name_tc: "酸酸的" },
  "spicy flavors": { id: "spicy", name_tc: "辣辣的" },
  "bitter flavors": { id: "bitter", name_tc: "苦苦的" },
  "dry flavors": { id: "astringent", name_tc: "澀澀的" },
  "plain flavors": { id: "plain", name_tc: "平淡無奇" },
  "no flavor": { id: "plain", name_tc: "平淡無奇" },
};

const FAVORITE_TC = {
  "lots of water": "很多水",
  "lots of nature": "很多自然",
  "exercise": "運動",
  "group activities": "團體活動",
  "watching stuff": "觀賞",
  "cute stuff": "可愛的東西",
  "soft stuff": "柔軟的東西",
  "strange stuff": "奇怪的東西",
  "shiny stuff": "閃亮的東西",
  "stone stuff": "石頭",
  "nice breezes": "清風",
  "lots of fire": "很多火",
  "luxury": "奢華",
  "cleanliness": "清潔",
  "wooden stuff": "木製品",
  "hard stuff": "堅硬的東西",
  "round stuff": "圓形的東西",
  "containers": "容器",
  "electronics": "電器",
  "ocean vibes": "海洋氛圍",
  "healing": "療癒",
  "slender objects": "細長的東西",
  "glass stuff": "玻璃",
  "lots of dirt": "很多土",
  "metal stuff": "金屬",
  "fabric": "布料",
  "colorful stuff": "色彩繽紛",
  "rides": "乘坐",
  "spooky stuff": "陰森的東西",
  "pretty flowers": "漂亮的花",
  "play spaces": "遊玩空間",
  "sharp stuff": "尖銳的東西",
  "wobbly stuff": "搖晃的東西",
  "complicated stuff": "複雜的東西",
  "construction": "建設",
  "garbage": "垃圾",
  "noisy stuff": "吵鬧的東西",
  "gatherings": "聚會",
  "spinning stuff": "旋轉的東西",
  "looks like food": "看起來像食物",
  "symbols": "符號",
  "letters and words": "文字",
  "blocky stuff": "方塊的東西",
  "none": "無",
};

const HABITAT_TC = {
  Bright: "明亮",
  Cool: "涼爽",
  Dark: "陰暗",
  Dry: "乾燥",
  Humid: "潮濕",
  Warm: "溫暖",
};

const LOCATION_TC = {
  "Withered Wastelands": "枯萎荒地",
  "Bleak Beach": "荒涼海灘",
  "Rocky Ridges": "岩脊",
  "Sparkling Skylands": "閃耀空島",
  "Palette Town": "調色鎮",
  "Cloud Island": "雲之島",
  "Bubbly Basin": "泡泡盆地",
};

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"' && text[i + 1] === '"') {
        cell += '"';
        i += 1;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        cell += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      row.push(cell);
      cell = "";
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && text[i + 1] === "\n") i += 1;
      row.push(cell);
      if (row.some((value) => value !== "")) rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += ch;
    }
  }
  if (cell || row.length) {
    row.push(cell);
    rows.push(row);
  }
  const headers = rows[0];
  return rows.slice(1).map((values) => {
    const record = {};
    headers.forEach((header, index) => {
      record[header] = values[index] ?? "";
    });
    return record;
  });
}

function slugName(name) {
  if (NAME_OVERRIDES[name]) return NAME_OVERRIDES[name];
  return name
    .toLowerCase()
    .replace(/[♀]/g, "-f")
    .replace(/[♂]/g, "-m")
    .replace(/['’.:,]/g, "")
    .replace(/\s+form$/i, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function favoriteKey(value) {
  return value.trim().toLowerCase();
}

function favoriteId(value) {
  return favoriteKey(value).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

async function download(url, dest) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url} → ${res.status}`);
  await pipeline(Readable.fromWeb(res.body), createWriteStream(dest));
}

const pokeapiFiles = {
  "pokemon.csv": "https://raw.githubusercontent.com/PokeAPI/pokeapi/master/data/v2/csv/pokemon.csv",
  "pokemon_species_names.csv": "https://raw.githubusercontent.com/PokeAPI/pokeapi/master/data/v2/csv/pokemon_species_names.csv",
  "pokemon_types.csv": "https://raw.githubusercontent.com/PokeAPI/pokeapi/master/data/v2/csv/pokemon_types.csv",
  "type_names.csv": "https://raw.githubusercontent.com/PokeAPI/pokeapi/master/data/v2/csv/type_names.csv",
};

await mkdir(rawDir, { recursive: true });
await mkdir(imgDir, { recursive: true });

for (const [file, url] of Object.entries(pokeapiFiles)) {
  const dest = resolve(rawDir, file);
  try {
    await readFile(dest);
  } catch {
    console.log("下載", file);
    await download(url, dest);
  }
}

const pokemonRows = parseCsv(await readFile(resolve(rawDir, "pokemon.csv"), "utf8"));
const byIdentifier = new Map();
for (const row of pokemonRows) {
  byIdentifier.set(row.identifier, row);
}

const names = parseCsv(await readFile(resolve(rawDir, "pokemon_species_names.csv"), "utf8"));
const nameTc = new Map();
const nameJp = new Map();
const nameEn = new Map();
for (const row of names) {
  const id = row.pokemon_species_id;
  if (row.local_language_id === "4") nameTc.set(id, row.name);
  if (row.local_language_id === "1") nameJp.set(id, row.name);
  if (row.local_language_id === "9") nameEn.set(id, row.name);
}

const typeNames = parseCsv(await readFile(resolve(rawDir, "type_names.csv"), "utf8"));
const typeTc = new Map();
const TYPE_IDS = {
  1: "normal",
  2: "fighting",
  3: "flying",
  4: "poison",
  5: "ground",
  6: "rock",
  7: "bug",
  8: "ghost",
  9: "steel",
  10: "fire",
  11: "water",
  12: "grass",
  13: "electric",
  14: "psychic",
  15: "ice",
  16: "dragon",
  17: "dark",
  18: "fairy",
};
for (const row of typeNames) {
  if (row.local_language_id === "4") typeTc.set(row.type_id, row.name);
}

const pokemonTypes = parseCsv(await readFile(resolve(rawDir, "pokemon_types.csv"), "utf8"));
const typesByPokemon = new Map();
for (const row of pokemonTypes) {
  const list = typesByPokemon.get(row.pokemon_id) ?? [];
  list.push({ slot: Number(row.slot), type_id: row.type_id });
  typesByPokemon.set(row.pokemon_id, list);
}

const pokopia = parseCsv(await readFile(resolve(rawDir, "Pokopia.csv"), "utf8"));
const unmatched = [];
const species = [];
const favoriteSet = new Map();
const flavorSet = new Map();
const typeSet = new Map();

for (const row of pokopia) {
  const nameEnRow = row.Name.trim();
  const identifier = slugName(nameEnRow);
  const uniqueId = `${Number(String(row.Number).replace("#", ""))}-${nameEnRow
    .toLowerCase()
    .replace(/[♀]/g, "f")
    .replace(/[♂]/g, "m")
    .replace(/['’.:,]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")}`;
  let poke = byIdentifier.get(identifier);
  if (!poke) {
    const stripped = identifier.replace(/-male|-female|-form.*/, "");
    poke = byIdentifier.get(stripped);
  }
  if (!poke) {
    unmatched.push(nameEnRow);
    continue;
  }

  const speciesId = poke.species_id;
  const nationalId = Number(speciesId);
  const pokemonId = Number(poke.id);
  const dex = Number(String(row.Number).replace("#", ""));
  const form = FORM_TC[nameEnRow];
  const baseTc = nameTc.get(speciesId);
  if (!baseTc) {
    unmatched.push(`${nameEnRow} (no zh-Hant)`);
    continue;
  }
  const displayTc = form ? `${baseTc}（${form}）` : baseTc;

  const typeList = (typesByPokemon.get(String(pokemonId)) ?? typesByPokemon.get(speciesId) ?? [])
    .sort((a, b) => a.slot - b.slot)
    .filter((entry) => TYPE_IDS[Number(entry.type_id)])
    .map((entry) => {
      const id = TYPE_IDS[Number(entry.type_id)];
      const name = typeTc.get(entry.type_id);
      typeSet.set(id, name);
      return { id, name_tc: name };
    });

  const rawFavs = ["Favorite 1", "Favorite 2", "Favorite 3", "Favorite 4", "Favorite 5", "Favorite 6"]
    .map((key) => row[key]?.trim())
    .filter(Boolean);

  let flavor = null;
  const favorites = [];
  for (const fav of rawFavs) {
    const key = favoriteKey(fav);
    if (key === "none") continue;
    const flavorHit = FLAVOR_MAP[key];
    if (flavorHit) {
      flavor = flavorHit;
      flavorSet.set(flavorHit.id, flavorHit.name_tc);
      continue;
    }
    const id = favoriteId(fav);
    const name_tc = FAVORITE_TC[key];
    if (!name_tc) {
      unmatched.push(`favorite:${fav}`);
      continue;
    }
    favoriteSet.set(id, { id, name_en: fav.replace(/\b\w/g, (c) => c), name_tc });
    favorites.push({ id, name_tc });
  }

  species.push({
    id: uniqueId,
    dex,
    national_id: nationalId,
    pokemon_id: pokemonId,
    name_tc: displayTc,
    name_species_tc: baseTc,
    name_en: nameEnRow,
    name_jp: nameJp.get(speciesId) ?? "",
    types: typeList.map((item) => item.name_tc),
    type_ids: typeList.map((item) => item.id),
    flavor_id: flavor?.id ?? "",
    flavor_tc: flavor?.name_tc ?? "",
    favorites: favorites.map((item) => item.id),
    favorites_tc: favorites.map((item) => item.name_tc),
    habitat: row["Ideal Habitat"] || "",
    habitat_tc: HABITAT_TC[row["Ideal Habitat"]] || row["Ideal Habitat"] || "",
    location_en: row["Primary Location"] || "",
    location_tc: LOCATION_TC[row["Primary Location"]] || row["Primary Location"] || "",
    specialties: [row["Specialty 1"], row["Specialty 2"]].filter(Boolean),
    image: `/pokedex/${pokemonId}.webp`,
    image_source: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${pokemonId}.png`,
    image_attr_tc: "PokeAPI Pokémon HOME 渲染圖（識別用，已於本地縮成 WebP）",
    source_url: row["Source URL"] || "",
    portal_url: `https://tw.portal-pokemon.com/play/pokedex/${String(nationalId).padStart(4, "0")}/`,
    pokopia_unique: UNIQUE_NPC.has(nameEnRow),
    confidence: "community-compiled",
  });
}

if (unmatched.length) {
  console.error("未對上：");
  for (const item of [...new Set(unmatched)]) console.error(" -", item);
}

species.sort((a, b) => a.dex - b.dex || a.id.localeCompare(b.id));

const TYPE_ORDER = ["normal", "fire", "water", "grass", "electric", "ice", "fighting", "poison", "ground", "flying", "psychic", "bug", "rock", "ghost", "dragon", "dark", "steel", "fairy"];
const FLAVOR_ORDER = ["sweet", "sour", "spicy", "bitter", "astringent", "plain"];

const dataset = {
  title_tc: "圖鑑",
  updated: "2026-10-12",
  game_version: "2.0.1",
  count: species.length,
  note_tc: "種族中文取自台灣官方圖鑑用語（PokeAPI zh-Hant／台灣寶可夢官方網站圖鑑）。口味、棲息與喜好類來自社群表（PokopiaPlanning／Serebii），信心標為社群彙整。卡片圖為 PokeAPI HOME 渲染縮圖。",
  sources: [
    {
      name: "JEschete/PokopiaPlanning reference/Pokopia.csv",
      url: "https://github.com/JEschete/PokopiaPlanning",
    },
    {
      name: "Serebii Pokémon Pokopia Pokédex",
      url: "https://www.serebii.net/pokemonpokopia/pokedex/",
    },
    {
      name: "台灣寶可夢官方網站圖鑑",
      url: "https://tw.portal-pokemon.com/play/pokedex/",
    },
    {
      name: "PokeAPI species names (zh-Hant) + HOME sprites",
      url: "https://github.com/PokeAPI/pokeapi",
    },
    {
      name: "PokeAPI Pokémon HOME sprites",
      url: "https://github.com/PokeAPI/sprites",
    },
    {
      name: "partywhale/pokemon-type-icons（MIT）",
      url: "https://github.com/partywhale/pokemon-type-icons",
    },
  ],
  types: TYPE_ORDER.filter((id) => typeSet.has(id)).map((id) => ({ id, name_tc: typeSet.get(id) })),
  flavors: FLAVOR_ORDER.filter((id) => flavorSet.has(id)).map((id) => ({ id, name_tc: flavorSet.get(id) })),
  habitats: [
    { id: "bright", name_tc: "明亮" },
    { id: "humid", name_tc: "潮濕" },
    { id: "dark", name_tc: "陰暗" },
    { id: "warm", name_tc: "溫暖" },
    { id: "dry", name_tc: "乾燥" },
    { id: "cool", name_tc: "涼爽" },
  ],
  favorite_categories: [...favoriteSet.values()].sort((a, b) => a.name_tc.localeCompare(b.name_tc, "zh-Hant")),
  species,
};

await writeFile(resolve(root, "src/data/pokedex.json"), `${JSON.stringify(dataset, null, 2)}\n`);
console.log(`寫入 pokedex.json：${species.length} 筆，未對上 ${unmatched.length}`);

console.log("卡片圖請跑：node scripts/upgrade-pokedex-art.mjs（PokeAPI HOME → 256px WebP）");
