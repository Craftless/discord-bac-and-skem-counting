import { Client, IntentsBitField } from "discord.js";
import { config } from "./config";
import eventHandler from "./handlers/eventHandler";

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

(async () => {
  try {
    // await connect(process.env.MONGO_URI!);
    // console.log("Connected to db");
    eventHandler(client);
    client.login(config.DISCORD_TOKEN);
  } catch (error) {
    console.log(error);
  }
})();
