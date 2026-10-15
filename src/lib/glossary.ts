import extra from "../data/glossary-extra.json";
import food from "../data/food-flavors.json";
import islands from "../data/dream-islands.json";
import officialNames from "../data/official-names.json";
import type { DreamIslandsFile, FoodFlavorsFile, GlossaryTerm } from "./types";

const foodData = food as FoodFlavorsFile;
const islandsData = islands as DreamIslandsFile;

const flavorMaps = extra.flavors as Record<string, { name_jp: string; name_en: string }>;

export function buildGlossary(): GlossaryTerm[] {
  const terms: GlossaryTerm[] = [];

  for (const flavor of foodData.flavors) {
    const mapped = flavorMaps[flavor.id];
    terms.push({
      id: `flavor-${flavor.id}`,
      name_tc: flavor.name_tc,
      name_jp: mapped?.name_jp ?? "—",
      name_en: mapped?.name_en ?? "—",
      category_tc: "口味",
    });
  }

  for (const species of officialNames.species) {
    terms.push({
      id: `species-${species.id}`,
      name_tc: species.name_tc,
      name_jp: species.name_jp,
      name_en: species.name_en,
      category_tc: "種族",
    });
  }

  for (const island of islandsData.islands) {
    terms.push({
      id: `island-${island.id}`,
      name_tc: island.name_tc,
      name_jp: island.name_jp,
      name_en: island.name_en,
      category_tc: "夢島",
    });
  }

  for (const term of extra.housing) {
    terms.push({
      id: `housing-${term.id}`,
      name_tc: term.name_tc,
      name_jp: term.name_jp,
      name_en: term.name_en,
      category_tc: "房屋",
    });
  }

  for (const term of extra.cloud) {
    terms.push({
      id: `cloud-${term.id}`,
      name_tc: term.name_tc,
      name_jp: term.name_jp,
      name_en: term.name_en,
      category_tc: "雲島",
    });
  }

  return terms;
}

export const glossaryNote = extra.note_tc;
