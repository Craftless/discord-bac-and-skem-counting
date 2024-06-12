import { Client, CommandInteraction } from "discord.js";
import { crash } from "../../utils/skem/skemStore";

module.exports = {
  name: "uncrash",
  description: "Uncrashes the bot!",
  callback: async (client: Client, interaction: CommandInteraction) => {
    try {
      crash.delete(interaction.user.id);
      await interaction.reply("Uncrashed the bot!");
    } catch (error) {
      console.log(error);
    }
  },
};
