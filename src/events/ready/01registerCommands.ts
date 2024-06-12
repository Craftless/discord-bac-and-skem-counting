import { Client } from "discord.js";
import areCommandsDifferent from "../../utils/areCommandsDifferent";
import getApplicationCommands from "../../utils/getApplicationCommands";
import getLocalCommands from "../../utils/getLocalCommands";
const { testServers } = require("../../../config.json");

module.exports = async (client: Client) => {
  try {
    for (const testServer of testServers) {
      const localCommands = getLocalCommands();
      const applicationCommands = await getApplicationCommands(
        client,
        testServer
      );
      if (!applicationCommands)
        throw new Error("Application commands not found");
      for (const localCommand of localCommands) {
        const { name, description, options } = localCommand;
        const existingCommand = applicationCommands.cache.find(
          (cmd) => cmd.name === name
        );
        if (existingCommand) {
          if (localCommand.deleted) {
            await applicationCommands.delete(existingCommand.id);
            console.log(`Deleted command ${name}.`);
            continue;
          }
          if (areCommandsDifferent(existingCommand, localCommand)) {
            await applicationCommands.edit(existingCommand.id, {
              description,
              options,
            });
            console.log(`Edited command ${name}.`);
          }
        } else {
          if (localCommand.deleted) {
            console.log(
              `Skipping registering command ${name} as it's set to delete.`
            );
            continue;
          }
          await applicationCommands.create({
            name,
            description,
            options,
          });
          console.log(`Registered command ${name}`);
        }
      }
    }
  } catch (error) {
    console.log(`There was an error: ${error}`);
  }
};
