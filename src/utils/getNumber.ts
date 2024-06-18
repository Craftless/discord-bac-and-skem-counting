import { Message } from "discord.js";

export default (msg: Message) => parseInt(msg.content.split("*")[0]);
