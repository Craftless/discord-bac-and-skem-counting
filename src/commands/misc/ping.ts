import { Client, CommandInteraction } from "discord.js";

module.exports = {
  name: "ping",
  description: "Pong!",
  // testOnly: Boolean,
  // options: Object[],
  // deleted: Boolean, soft delete
  callback: async (client: Client, interaction: CommandInteraction) => {
    await interaction.deferReply();
    const reply = await interaction.fetchReply();
    const ping = reply.createdTimestamp - interaction.createdTimestamp;
    interaction.editReply(
      `Pong! Client ${ping}ms | Websocket: ${client.ws.ping}ms`
    );
  },
};
