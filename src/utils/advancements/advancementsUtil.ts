import { EmbedBuilder } from "discord.js";
import path from "path";
import getAllFiles from "../getAllFiles";
import getFileName from "../getFileName";
import getAdvancementId from "./getAdvancementId";

type AdvancementData = {
  AdvancementName: string;
  Description: string;
  Parent: string;
  ActualRequirements: string;
  Hidden: string;
  ItemRewards: string;
  XPRewards: number | null | "";
  Trophy: string;
  Source: string;
  VersionAdded: string;
  Notes: string;
};

type Advancement = AdvancementData & {
  XPRewards: number;
  Id: string;
  Tab: string;
};

const all_advancements: Advancement[] = [];

export const LOG_FILE = "/root/Season_2/RICCSMP/logs/latest.log";

export const TAB_COLOURS = {
  Mining: 0x999999,
  Building: 0xe69138,
  Farming: 0x9d7f56,
  Animals: 0x6aa84f,
  Monsters: 0x337be7,
  Weaponry: 0x9d7f56,
  Biomes: 0x6aa84f,
  Adventure: 0xffd966,
  Redstone: 0xcc0000,
  Enchanting: 0x20124d,
  Statistics: 0xb45f06,
  Nether: 0x990000,
  Potions: 0xbf9000,
  End: 0x8e7cc3,
};

export const TYPE_COLOURS = {
  task: 0x93c47d,
  goal: 0x6d9eeb,
  challenge: 0xc27ba0,
  super_challenge: 0xe06666,
  hidden: 0xd5a6bd,
  milestone: 0xffe599,
  advancement_legend: 0xf6b26b,
};

export function loadAdvancements() {
  const advDataDirectory = path.join(__dirname, "data");
  for (const advData of getAllFiles(advDataDirectory)) {
    const advancements: AdvancementData[] = require(advData);
    all_advancements.push(
      ...advancements.map((adv) => ({
        ...adv,
        XPRewards: adv.XPRewards || 0,
        Tab:
          getFileName(advData).charAt(0).toUpperCase() +
          getFileName(advData).slice(1),
        Id: getAdvancementId(adv.AdvancementName),
      }))
    );
  }
  console.log("Loaded all advancements");
}

export function getAdvancementFromName(name: string) {
  return getAllAdvancements().find(
    (adv) => adv.AdvancementName.toLowerCase() === name.toLowerCase()
  );
}

export function getAllAdvancementNames() {
  return getAllAdvancements().map((adv) => adv.AdvancementName);
}

export function getAllAdvancements() {
  if (!all_advancements.length) loadAdvancements();
  return all_advancements;
}

export function advancementEmbedBuilder(adv: Advancement, colour?: number) {
  const embed = new EmbedBuilder()
    .setTitle(adv.AdvancementName || "This advancement does not exist")
    // @ts-ignore
    .setColor(colour || TAB_COLOURS[adv.Tab] || "Random")
    .addFields({
      name: "Description",
      value: adv.Description || "None",
    })
    .addFields(
      {
        name: "Tab",
        value: adv.Tab,
        inline: true,
      },
      {
        name: "Parent",
        value: adv.Parent || "None",
        inline: true,
      },
      {
        name: "Hidden",
        value: adv.Hidden === "TRUE" ? "Yes" : "No",
        inline: true,
      }
    )
    .addFields(
      {
        name: "Item Rewards",
        value: adv.ItemRewards || "None",
        inline: true,
      },
      {
        name: "XP Rewards",
        value: adv.XPRewards ? `${adv.XPRewards} XP` : "None",
        inline: true,
      },
      {
        name: "Trophy Rewarded",
        value: adv.Trophy || "None",
        inline: true,
      }
    );

  if (adv.ActualRequirements)
    embed.addFields({
      name: "Actual Requirements",
      value: adv.ActualRequirements,
    });

  if (adv.Notes)
    embed.addFields({
      name: "Notes",
      value: adv.Notes || "None",
    });

  return embed;
}
