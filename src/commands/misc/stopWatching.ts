import { Client, CommandInteraction } from "discord.js";
import fs from "fs";
import { logFile } from "./setupAdv";

module.exports = {
  name: "stop_watching",
  description: "Stop watching advancements",
  devOnly: true,
  callback: async (client: Client, interaction: CommandInteraction) => {
    fs.unwatchFile(logFile);
    await interaction.reply("Stopped watching log file!");
  },
};
