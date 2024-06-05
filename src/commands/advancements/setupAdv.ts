import { Client, CommandInteraction } from "discord.js";
import fs from "fs";
import {
  LOG_FILE,
  TYPE_COLOURS,
  advancementEmbedBuilder,
  getAdvancementFromName,
} from "../../utils/advancements/advancementsUtil";
import words from "../../utils/advancements/words.json";

const endOfLineChar = require("os").EOL;

const sizes: { [key: string]: number } = {};

module.exports = {
  name: "setup_advancements",
  description: "Setup Adv",
  devOnly: true,
  callback: async (client: Client, interaction: CommandInteraction) => {
    await interaction.reply({ content: "Watching log file!", ephemeral: true });
    if (!interaction.guildId) return;
    sizes.log = fs.statSync(LOG_FILE).size;
    fs.watchFile(LOG_FILE, {}, function (cur: fs.Stats, prev: fs.Stats) {
      if (cur.mtime <= prev.mtime) {
        return;
      }
      const newFileSize = fs.statSync(LOG_FILE).size;
      let sizeDiff = newFileSize - sizes.log;
      if (sizeDiff < 0) {
        sizes.log = 0;
        sizeDiff = newFileSize;
      }
      const buffer = new Buffer(sizeDiff);
      const fileDescriptor = fs.openSync(LOG_FILE, "r");
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
    if (!line.endsWith("]")) continue;
    const info = line.split("[Server thread/INFO]: ")[1];
    for (const [type, phrase] of Object.entries(words)) {
      if (info.includes(phrase)) {
        const advancementName = (info.match(/(?<=\[).+?(?=\])/) || [""])[0];
        const playerName = info.split(phrase)[0].slice(0, -1);
        const advancement = getAdvancementFromName(advancementName);
        if (!advancement) {
          // @ts-ignore
          channel.send(info);
          continue;
        }
        console.log(advancementName);
        console.log(advancement);
        // @ts-ignore
        const colour = TYPE_COLOURS[type];
        // @ts-ignore
        channel.send({
          content: `**${playerName}** ${phrase} **[${advancementName}]**\n`,
          embeds: [advancementEmbedBuilder(advancement, colour)],
        });
        break;
      }
    }
  }
}
