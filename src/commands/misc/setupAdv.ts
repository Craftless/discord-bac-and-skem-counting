import { Client, CommandInteraction } from "discord.js";
import fs from "fs";

const endOfLineChar = require("os").EOL;
export const logFile = "/root/Season_2/RICCSMP/logs/latest.log";

const sizes: { [key: string]: number } = {};

module.exports = {
  name: "setup_advancements",
  description: "Setup Adv",
  devOnly: true,
  callback: async (client: Client, interaction: CommandInteraction) => {
    await interaction.reply("Watching log file!");
    if (!interaction.guildId) return;
    sizes.log = fs.statSync(logFile).size;
    fs.watchFile(logFile, {}, function (cur: fs.Stats, prev: fs.Stats) {
      if (cur.mtime <= prev.mtime) {
        return;
      }
      const newFileSize = fs.statSync(logFile).size;
      let sizeDiff = newFileSize - sizes.log;
      if (sizeDiff < 0) {
        sizes.log = 0;
        sizeDiff = newFileSize;
      }
      const buffer = new Buffer(sizeDiff);
      const fileDescriptor = fs.openSync(logFile, "r");
      fs.readSync(fileDescriptor, buffer, 0, sizeDiff, sizes.log);
      fs.closeSync(fileDescriptor);
      sizes.log = newFileSize;
      parseBuffer(client, buffer, interaction.channelId);
    });
  },
};

async function parseBuffer(client: Client, buffer: Buffer, channelId: string) {
  const channel = await client.channels.fetch(channelId);
  if (!channel) return;
  const lines = buffer.toString().split(endOfLineChar);
  for (const line of lines) {
    if (!line) return;
    // @ts-ignore
    channel.send(line);
  }
}
