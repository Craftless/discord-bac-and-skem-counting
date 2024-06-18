import { Client, EmbedBuilder, Message } from "discord.js";
import getNumber from "../../utils/getNumber";
import { crash, next } from "../../utils/skem/skemStore";

module.exports = async (client: Client, msg: Message) => {
  if (crash.has(msg.author.id)) return;
  const msgs = Array.from(
    (await msg.channel.messages.fetch({ limit: 2 })).values()
  );
  if (msgs.length < 2) return;
  const nxt = next.get(msg.author.id);
  if (nxt) {
    if (nxt === "tick" || nxt === "highest") {
      tick(msgs, nxt === "highest");
    } else {
      cross(msg, getNumber(msgs[1]), nxt);
    }
    next.delete(msg.author.id);
    return;
  }
  if (
    msg.content === "1** **" &&
    msgs[1].author.id === client.application?.id
  ) {
    tick(msgs);
    return;
  }
  if (!msgs.every((m) => m.content.match(/^([0-9]+?(\*\* \*\*)*)$/g))) return;
  if (msg.content.includes("** **")) {
    const prev = getNumber(msgs[1]);
    const cur = getNumber(msgs[0]);
    if (prev + 1 === cur && msgs[1].author.id !== msgs[0].author.id) {
      tick(msgs);
    } else {
      msg.react("❌");
      cross(
        msg,
        prev,
        msgs[1].author.id === msgs[0].author.id ? "twice" : "wrong"
      );
    }
  }
};

function tick(msgs: Message[], inHighest?: boolean) {
  const highest = // @ts-ignore
    inHighest ?? msgs[1].reactions.cache.some((rxn) => rxn == "☑️");
  msgs[0].react(highest ? "☑️" : "✅");
}

function cross(msg: Message, prev: number, reason: "wrong" | "twice") {
  msg.react("❌");
  const error =
    reason === "twice"
      ? "You can't count two numbers in a row."
      : "Wrong number.";
  const embed = new EmbedBuilder()
    .setDescription(
      "Vote [here](https://www.craftless.live) to earn saves so you can continue counting next time. See `c!help`."
    )
    .setColor(9004502);
  msg.reply({
    content: `<@${msg.author.id}> RUINED IT AT **${prev}**!! Next number is **1**. **${error}**`,
    embeds: [embed],
  });
}
