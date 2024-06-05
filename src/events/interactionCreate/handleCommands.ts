import {
  CacheType,
  Client,
  Interaction,
  PermissionsBitField,
} from "discord.js";
import { devs, testServers } from "../../../config.json";
import getLocalCommands from "../../utils/getLocalCommands";

module.exports = async (
  client: Client,
  interaction: Interaction<CacheType>
) => {
  if (!interaction.isChatInputCommand()) return;
  if (!interaction.member) return;
  const localCommands = getLocalCommands();
  try {
    const commandObject = localCommands.find(
      (cmd) => cmd.name === interaction.commandName
    );
    if (!commandObject) return;
    if (commandObject.devOnly) {
      if (!devs.includes(interaction.member.user.id)) {
        interaction.reply({
          content: "Only devs are allowed to run this command",
          ephemeral: true,
        });
        return;
      }
    }
    if (commandObject.testOnly) {
      if (!testServers.includes(interaction.guild?.id || "")) {
        interaction.reply({
          content: "This command cannot be run here",
          ephemeral: true,
        });
        return;
      }
    }
    if (commandObject.permissionsRequired?.length) {
      for (const permission of commandObject.permissionsRequired) {
        if (
          !(
            interaction.member.permissions as Readonly<PermissionsBitField>
          ).has(permission)
        ) {
          interaction.reply({
            content: "Not enough permissions",
            ephemeral: true,
          });
          return;
        }
      }
    }
    if (commandObject.botPermissions?.length) {
      for (const permission of commandObject.botPermissions) {
        const bot = interaction.guild?.members.me;
        if (
          !(bot?.permissions as Readonly<PermissionsBitField>).has(permission)
        ) {
          interaction.reply({
            content: "I don't have enough permissions",
            ephemeral: true,
          });
          return;
        }
      }
    }
    await commandObject.callback(client, interaction);
  } catch (error) {
    console.log(`There was an error running this command: ${error}`);
  }
};
