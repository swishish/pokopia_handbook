import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const CONFIDENCE = new Set([
  "official",
  "community-tested",
  "community-compiled",
  "unverified",
]);

function fail(message) {
  console.error(`資料驗證失敗：${message}`);
  process.exitCode = 1;
}

async function load(name) {
  const text = await readFile(resolve(root, "src/data", name), "utf8");
  return JSON.parse(text);
}

function requireFields(record, fields, label) {
  for (const field of fields) {
    if (record[field] === undefined || record[field] === null || record[field] === "") {
      fail(`${label} 缺少欄位 ${field}`);
    }
  }
}

function uniqueIds(items, label) {
  const seen = new Set();
  for (const item of items) {
    if (seen.has(item.id)) fail(`${label} 重複 id：${item.id}`);
    seen.add(item.id);
  }
}

const site = await load("site.json");
const housing = await load("housing-rules.json");
const food = await load("food-flavors.json");
const islands = await load("dream-islands.json");
const tools = await load("tools-directory.json");

if (!site.game_version) fail("site.json 缺少 game_version");
if (housing.game_version !== site.game_version) {
  fail(`房屋規則版本 ${housing.game_version} 與站台 ${site.game_version} 不一致`);
}
if (food.game_version !== site.game_version) {
  fail(`食物資料版本 ${food.game_version} 與站台 ${site.game_version} 不一致`);
}

if (!housing.rules?.length) fail("房屋規則為空");
uniqueIds(housing.rules, "房屋規則");
for (const rule of housing.rules) {
  requireFields(rule, ["id", "title_tc", "body_tc", "confidence", "verified_at", "source_note_tc"], `房屋規則 ${rule.id}`);
  if (!CONFIDENCE.has(rule.confidence)) fail(`房屋規則 ${rule.id} 信心標籤不合法`);
}

if (!food.flavors?.length) fail("食物口味為空");
uniqueIds(food.flavors, "口味");
for (const flavor of food.flavors) {
  requireFields(flavor, ["id", "name_tc", "items"], `口味 ${flavor.id}`);
  uniqueIds(flavor.items, `食物 ${flavor.id}`);
  for (const item of flavor.items) {
    requireFields(item, ["id", "name_tc", "source_type"], `食物 ${item.id}`);
    if (!item.name_tc.trim()) fail(`食物 ${item.id} 名稱空白`);
  }
}

if (!islands.islands?.length) fail("夢島為空");
uniqueIds(islands.islands, "夢島");
for (const island of islands.islands) {
  requireFields(island, ["id", "name_tc", "name_jp", "name_en"], `夢島 ${island.id}`);
}

if (!tools.directory?.length) fail("工具目錄為空");
uniqueIds(tools.directory, "工具");
for (const tool of tools.directory) {
  requireFields(tool, ["id", "name", "url", "lang", "cost", "limitations_tc", "last_checked"], `工具 ${tool.id}`);
  if (!tool.lang.length) fail(`工具 ${tool.id} 缺少語言`);
}

const pokedex = await load("pokedex.json");
if (!pokedex.species?.length) fail("圖鑑為空");
uniqueIds(pokedex.species, "圖鑑");
const TYPE_TC = new Set(["一般", "火", "水", "草", "電", "冰", "格鬥", "毒", "地面", "飛行", "超能力", "蟲", "岩石", "幽靈", "龍", "惡", "鋼", "妖精"]);
for (const mon of pokedex.species) {
  requireFields(mon, ["id", "dex", "name_tc", "name_en", "confidence"], `圖鑑 ${mon.id}`);
  if (!mon.name_tc.trim()) fail(`圖鑑 ${mon.id} 名稱空白`);
  for (const type of mon.types ?? []) {
    if (!TYPE_TC.has(type)) fail(`圖鑑 ${mon.id} 屬性不是官方繁中：${type}`);
  }
}

if (process.exitCode) {
  process.exit(process.exitCode);
}

console.log("資料驗證通過。");
