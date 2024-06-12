import { Client, CommandInteraction } from "discord.js";
import { crash } from "../../utils/skem/skemStore";

module.exports = {
  name: "crash",
  description: "Crash the bot (totally)!",
  callback: async (client: Client, interaction: CommandInteraction) => {
    try {
      crash.add(interaction.user.id);
      await interaction.reply("Crashed the bot!");
    } catch (error) {
      console.log(error);
    }
  },
};
