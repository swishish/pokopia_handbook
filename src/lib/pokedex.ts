export const WATER_FAVS = new Set(["lots-of-water", "ocean-vibes"]);

const SPECIALTY_TC: Record<string, string> = {
  Grow: "栽培",
  Water: "澆水",
  Build: "建築",
  Chop: "砍樹",
  Collect: "收集",
  Gather: "採集",
  "Gather Honey": "採蜜",
  Search: "搜尋",
  Scrub: "擦洗",
  Recycle: "分類",
  Litter: "散落素材",
  Eat: "貪吃",
  Fly: "飛行",
  Burn: "燃燒",
  Crush: "粉碎",
  Bulldoze: "整地",
  Illuminate: "發光",
  Paint: "塗裝",
  Party: "派對",
  Hype: "炒熱",
  DJ: "DJ",
  Engineer: "工程",
  Explode: "爆炸",
  Generate: "發電",
  Storage: "收納",
  Teleport: "傳送",
  Trade: "交換",
  Transform: "變身",
  Yawn: "打哈欠",
  "Dream Island": "夢島",
  Rarify: "稀有物",
  Appraise: "鑑定",
  "???": "未標",
};

const LOCATION_FIX: Record<string, string> = {
  "Dream Island": "夢島",
};

export type PokedexSpecies = {
  id: string;
  dex: number;
  national_id: number;
  pokemon_id: number;
  name_tc: string;
  name_species_tc: string;
  name_en: string;
  name_jp: string;
  types: string[];
  type_ids: string[];
  flavor_id: string;
  flavor_tc: string;
  favorites: string[];
  favorites_tc: string[];
  habitat?: string;
  habitat_tc: string;
  location_en: string;
  location_tc: string;
  specialties: string[];
  image: string;
  image_source: string;
  image_attr_tc: string;
  source_url: string;
  portal_url: string;
  pokopia_unique: boolean;
  confidence: string;
};

export function habitatId(mon: { habitat?: string }) {
  return String(mon.habitat ?? "").toLowerCase();
}

export function waterLabels(mon: { favorites: string[]; favorites_tc: string[] }) {
  return mon.favorites
    .map((id, index) => ({ id, label: mon.favorites_tc[index] }))
    .filter((item) => WATER_FAVS.has(item.id));
}

export function likedTags(mon: { favorites: string[]; favorites_tc: string[] }) {
  return mon.favorites
    .map((id, index) => ({ id, label: mon.favorites_tc[index] }))
    .filter((item) => !WATER_FAVS.has(item.id) && item.label);
}

export function specialtyTc(name: string) {
  return SPECIALTY_TC[name] ?? name;
}

export function locationTc(mon: { location_en: string; location_tc: string }) {
  if (mon.location_tc && mon.location_tc !== mon.location_en) return mon.location_tc;
  return LOCATION_FIX[mon.location_en] ?? mon.location_tc ?? "";
}

export function speciesHref(id: string) {
  return `/pokedex/${id}/`;
}

export function padDex(n: number) {
  return String(n).padStart(3, "0");
}

export function padNational(n: number) {
  return String(n).padStart(4, "0");
}
