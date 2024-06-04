import { Client, IntentsBitField } from "discord.js";
import { config } from "./config";

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

client.on("messageCreate", async (msg) => {
  const msgs = Array.from(
    (await msg.channel.messages.fetch({ limit: 2 })).values()
  );
  if (msgs.length < 2) return;
  if (!msgs.every((m) => m.content.match(/^([0-9]+?(\*\* \*\*)*)$/g))) return;
  if (msg.content.includes("** **")) {
    if (
      parseInt(msgs[1].content) + 1 ===
      parseInt(msgs[0].content.split("*")[0])
    ) {
      msg.react("✅");
    } else {
      msg.react("❌");
    }
  }
});

client.on("ready", (c) => {
  console.log("Ready");
});

client.login(config.DISCORD_TOKEN);
