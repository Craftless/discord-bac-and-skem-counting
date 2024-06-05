import { Client, CommandInteraction } from "discord.js";
import fs from "fs";
import { LOG_FILE } from "../../utils/advancements/advancementsUtil";

module.exports = {
  name: "stop_watching",
  description: "Stop watching advancements",
  devOnly: true,
  callback: async (client: Client, interaction: CommandInteraction) => {
    try {
      fs.unwatchFile(LOG_FILE);
      await interaction.reply({
        content: "Stopped watching log file!",
        ephemeral: true,
      });
    } catch (error) {
      console.log("Cannot stop watching log file!", error);
    }
  },
};
