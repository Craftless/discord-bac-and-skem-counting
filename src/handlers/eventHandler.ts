import { Client } from "discord.js";
import path from "path";
import getAllFiles from "../utils/getAllFiles";
import getFileName from "../utils/getFileName";

export default (client: Client) => {
  const eventFolders = getAllFiles(path.join(__dirname, "..", "events"), true);
  for (const eventFolder of eventFolders) {
    const eventFiles = getAllFiles(eventFolder);
    eventFiles.sort();
    const eventName = getFileName(eventFolder); // split never returns an empty array
    client.on(eventName, async (arg) => {
      for (const eventFile of eventFiles) {
        const eventFn = require(eventFile);
        await eventFn(client, arg);
      }
    });
  }
};
