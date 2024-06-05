import {
  ApplicationCommandOptionData,
  Client,
  CommandInteraction,
  PermissionResolvable,
} from "discord.js";
import path from "path";
import getAllFiles from "./getAllFiles";

export default (exceptions: string[] = []): Command[] => {
  let localCommands = [];

  const commandCategories = getAllFiles(
    path.join(__dirname, "..", "commands"),
    true
  );
  for (const commandCategory of commandCategories) {
    const commandFiles = getAllFiles(commandCategory);
    for (const commandFile of commandFiles) {
      const commandObject = require(commandFile);
      if (exceptions.includes(commandObject.name)) continue;
      localCommands.push(commandObject);
    }
  }

  console.log(commandCategories);

  return localCommands;
};

export type Command = {
  name: string;
  description: string;
  devOnly?: boolean;
  testOnly?: boolean;
  options?: ApplicationCommandOptionData[];
  permissionsRequired?: PermissionResolvable[];
  botPermissions?: PermissionResolvable[];
  deleted?: boolean;
  callback: (client: Client, interaction: CommandInteraction) => {};
};
