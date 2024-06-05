import { Client } from "discord.js";

module.exports = (client: Client) => {
  console.log("Ready");
  client.user?.setActivity({
    name: "c!help",
  });
  client.user?.setStatus("invisible");
};
