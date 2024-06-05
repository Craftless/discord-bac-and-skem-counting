import { CacheType, Client, Interaction } from "discord.js";
import { getAllAdvancements } from "../../utils/advancements/advancementsUtil";

module.exports = async (
  client: Client,
  interaction: Interaction<CacheType>
) => {
  console.log("interaction");
  if (!interaction.isAutocomplete()) return;

  if (interaction.commandName === "advancement_info") {
    const focusedValue = interaction.options.getFocused();
    const filteredChoices = getAllAdvancements().filter(
      (adv) =>
        adv.AdvancementName.toLowerCase().includes(
          focusedValue.toLowerCase()
        ) || adv.Tab.toLowerCase().includes(focusedValue.toLowerCase())
    );

    const results = filteredChoices.map((choice) => ({
      name: `${choice.AdvancementName} - ${choice.Tab}`,
      value: choice.Id,
    }));

    interaction.respond(results.slice(0, 25)).catch(() => {});
  }
};
