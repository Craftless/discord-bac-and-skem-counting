import {
  ApplicationCommandOptionType,
  Client,
  CommandInteraction,
} from "discord.js";
import { next } from "../../utils/skem/skemStore";

module.exports = {
  name: "just",
  description: "Just...",
  options: [
    {
      name: "choice",
      description: "Choice",
      type: ApplicationCommandOptionType.String,
      required: true,
      choices: [
        {
          name: "tick",
          value: "tick",
        },
        {
          name: "highest tick",
          value: "highest",
        },
        {
          name: "wrong number",
          value: "wrong",
        },
        {
          name: "twice in a row",
          value: "twice",
        },
      ],
    },
  ],
  callback: async (client: Client, interaction: CommandInteraction) => {
    try {
      const choice = interaction.options.get("choice")?.value as
        | "tick"
        | "wrong"
        | "twice"
        | "highest";
      next.set(interaction.user.id, choice);
      await interaction.reply({
        content: `Set next response to \`\`\`${choice}\`\`\``,
        ephemeral: true,
      });
    } catch (error) {
      console.log(error);
    }
  },
};
