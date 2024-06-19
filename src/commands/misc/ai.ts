import {
  ApplicationCommandOptionType,
  Client,
  CommandInteraction,
} from "discord.js";
import { openai } from "../..";

module.exports = {
  name: "ai",
  description: "ChatGPT",
  options: [
    {
      name: "prompt",
      description: "Prompt",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: "role",
      description: "Role definition",
      type: ApplicationCommandOptionType.String,
      required: false,
    },
  ],
  callback: async (client: Client, interaction: CommandInteraction) => {
    await interaction.deferReply();
    const prompt = interaction.options.get("prompt")!.value as string;
    const rolePrompt = interaction.options.get("role")!.value as string;
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: rolePrompt || "You are a helpful assistant.",
        },
        { role: "user", content: prompt },
      ],
      model: "gpt-4o",
    });
    interaction.editReply(completion.choices[0].message);
  },
};
