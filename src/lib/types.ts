export type Confidence = "official" | "community-tested" | "community-compiled" | "unverified";

export type HousingRule = {
  id: string;
  title_tc: string;
  body_tc: string;
  confidence: Confidence;
  verified_at: string;
  source_note_tc: string;
};

export type HousingRulesFile = {
  title_tc: string;
  game_version: string;
  updated: string;
  disclaimer_tc: string;
  rules: HousingRule[];
};

export type FoodItem = {
  id: string;
  name_tc: string;
  source_type: Confidence | "community-compiled";
};

export type FlavorGroup = {
  id: string;
  name_tc: string;
  items: FoodItem[];
};

export type FoodFlavorsFile = {
  title_tc: string;
  updated: string;
  game_version: string;
  note_tc: string;
  flavors: FlavorGroup[];
};

export type DreamIsland = {
  id: string;
  name_tc: string;
  name_jp: string;
  name_en: string;
  look_tc: string;
  doll_tc: string;
  key_resources_tc: string[];
  legendary_tc: string | null;
  dlc: boolean;
};

export type DreamIslandsFile = {
  title: string;
  title_tc: string;
  updated: string;
  sources: string[];
  rules: {
    reset: string;
    visits_per_day: string;
    destruction: string;
    common_loot: string[];
  };
  islands: DreamIsland[];
};

export type ToolTask = {
  task_tc: string;
  primary: string;
  alt: string;
  why_tc: string;
};

export type ToolEntry = {
  id: string;
  name: string;
  url: string;
  lang: string[];
  cost: string;
  best_for_tc: string;
  limitations_tc: string;
  last_checked: string;
};

export type ToolsDirectoryFile = {
  title_tc: string;
  updated: string;
  last_checked: string;
  by_task: ToolTask[];
  directory: ToolEntry[];
};

export type GlossaryTerm = {
  id: string;
  name_tc: string;
  name_jp: string;
  name_en: string;
  category_tc: string;
};
