import { Client } from "discord.js";

export default async (client: Client, guildId: string) => {
  let applicationCommands;
  if (guildId) {
    const guild = await client.guilds.fetch(guildId);
    applicationCommands = guild.commands;
  } else {
    applicationCommands = client.application?.commands;
  }
  await applicationCommands?.fetch({ guildId });
  return applicationCommands;
};
