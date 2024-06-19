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
    try {
      const prompt = interaction.options.get("prompt")!.value as string;
      const rolePrompt = interaction.options.get("role")?.value as
        | string
        | undefined;
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
      const responseMessage = completion.choices[0].message.content;
      if (!responseMessage) {
        interaction.editReply("Error: No response was given.");
        return;
      }
      if (responseMessage.length <= 2000) {
        interaction.editReply(completion.choices[0].message);
        return;
      }
      interaction.editReply("Response is too long, splitting into chunks.");
      const chunkSizeLimit = 2000;
      for (let i = 0; i < responseMessage.length; i += chunkSizeLimit) {
        const chunk = responseMessage.substring(i, i + chunkSizeLimit);
        await interaction.channel?.send(chunk);
      }
    } catch (error) {
      interaction.editReply(String(error));
    }
  },
};
