import { Client, EmbedBuilder, IntentsBitField } from "discord.js";
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
  if (msg.content.includes("RUINED")) {
    console.log(msg.content);
    console.log("Color", msg.embeds[0].color);
    console.log(msg.author.id);
  }
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
      const error =
        parseInt(msgs[1].content) === parseInt(msgs[0].content.split("*")[0])
          ? "You can't count two numbers in a row."
          : "Wrong number.";
      const embed = new EmbedBuilder()
        .setDescription(
          "Vote [here](https://www.craftless.live) to earn saves so you can continue counting next time. See `c!help."
        )
        .setColor(9004502);
      msg.channel.send({
        content: `<@${msg.author.id}> RUINED IT AT **${msgs[1].content}**!! Next number is **1**. **${error}**`,
        embeds: [embed],
      });
    }
  }
});

client.on("ready", (c) => {
  console.log("Ready");
  client.user?.setActivity({
    name: "c!help",
  });
});

client.login(config.DISCORD_TOKEN);
