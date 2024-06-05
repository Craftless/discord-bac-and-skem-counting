import { Client, EmbedBuilder, Message } from "discord.js";

module.exports = async (client: Client, msg: Message) => {
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
    console.log(msgs[1].author.id, msgs[0].author.id);
    const prev = parseInt(msgs[1].content.split("*")[0]);
    const cur = parseInt(msgs[0].content.split("*")[0]);
    if (prev + 1 === cur && msgs[1].author.id !== msgs[0].author.id) {
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
        content: `<@${msg.author.id}> RUINED IT AT **${prev}**!! Next number is **1**. **${error}**`,
        embeds: [embed],
      });
    }
  }
};
