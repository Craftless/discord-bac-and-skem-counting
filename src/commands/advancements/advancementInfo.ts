import {
  ApplicationCommandOptionType,
  Client,
  CommandInteraction,
} from "discord.js";
import {
  advancementEmbedBuilder,
  getAllAdvancements,
} from "../../utils/advancements/advancementsUtil";
import { Command } from "../../utils/getLocalCommands";

module.exports = {
  name: "advancement_info",
  description: "Information about an advancement",
  options: [
    {
      name: "advancement-name",
      description: "The name of the advancement",
      type: ApplicationCommandOptionType.String,
      required: true,
      autocomplete: true,
    },
  ],
  callback: async (client: Client, interaction: CommandInteraction) => {
    try {
      const advChoice = interaction.options.get("advancement-name")!
        .value as string;

      const adv = getAllAdvancements().find((val) => val.Id === advChoice);
      if (!adv) {
        interaction.reply("This advancement does not exist");
        return;
      }

      await interaction.reply({ embeds: [advancementEmbedBuilder(adv)] });
    } catch (error) {
      console.log(error);
    }
  },
} as Command;
