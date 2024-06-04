import { Client, EmbedBuilder, IntentsBitField } from "discord.js";
import { commands } from "./commands";
import { config } from "./config";
import { deployCommands } from "./register-commands";

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
  if (
    msg.content === "1** **" &&
    msgs[1].author.id === client.application?.id
  ) {
    msg.react("✅");
    return;
  }
  if (!msgs.every((m) => m.content.match(/^([0-9]+?(\*\* \*\*)*)$/g))) return;
  if (msg.content.includes("** **")) {
    console.log(msgs[1].content);
    if (
      parseInt(msgs[1].content) + 1 ===
      parseInt(msgs[0].content.split("*")[0])
    ) {
      msg.react("✅");
    } else {
      msg.react("❌");
      const error =
        msgs[1].author.id === msgs[0].author.id
          ? "You can't count two numbers in a row."
          : "Wrong number.";
      const embed = new EmbedBuilder()
        .setDescription(
          "Vote [here](https://www.craftless.live) to earn saves so you can continue counting next time. See `c!help`."
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
  client.user?.setStatus("invisible");
});

client.on("guildCreate", async (guild) => {
  await deployCommands({ guildId: guild.id });
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) {
    return;
  }
  const { commandName } = interaction;
  if (commands[commandName as keyof typeof commands]) {
    commands[commandName as keyof typeof commands].execute(interaction);
  }
});

client.login(config.DISCORD_TOKEN);
