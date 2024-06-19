import { Client, IntentsBitField } from "discord.js";
import OpenAI from "openai";
import { config } from "./config";
import eventHandler from "./handlers/eventHandler";
import { loadAdvancements } from "./utils/advancements/advancementsUtil";

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.GuildMessageReactions,
    IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.DirectMessages,
  ],
});

export const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

(async () => {
  try {
    // await connect(process.env.MONGO_URI!);
    // console.log("Connected to db");
    eventHandler(client);
    loadAdvancements();
    client.login(config.DISCORD_TOKEN);
  } catch (error) {
    console.log(error);
  }
})();
