import {
  ApplicationCommand,
  ApplicationCommandOption,
  ApplicationCommandOptionChoiceData,
} from "discord.js";
import { Command } from "./getLocalCommands";

export default (existingCommand: ApplicationCommand, localCommand: Command) => {
  const areChoicesDifferent = (
    existingChoices: ApplicationCommandOptionChoiceData[],
    localChoices: ApplicationCommandOptionChoiceData[]
  ) => {
    for (const localChoice of localChoices) {
      const existingChoice = existingChoices?.find(
        (choice) => choice.name === localChoice.name
      );

      if (!existingChoice) {
        return true;
      }
      if (localChoice.value !== existingChoice.value) {
        return true;
      }
    }
    return false;
  };

  const areOptionsDifferent = (
    existingOptions: ApplicationCommandOption[],
    localOptions: ApplicationCommandOption[]
  ) => {
    for (const localOption of localOptions) {
      const existingOption = existingOptions?.find(
        (option) => option.name === localOption.name
      );

      if (!existingOption) {
        return true;
      }

      if (
        localOption.autocomplete !== existingOption.autocomplete ||
        localOption.description !== existingOption.description ||
        localOption.type !== existingOption.type || // @ts-ignore
        (localOption.required || false) !== existingOption.required || // @ts-ignore
        (localOption.choices?.length || 0) !== // @ts-ignore
          (existingOption.choices?.length || 0) ||
        areChoicesDifferent(
          // @ts-ignore
          localOption.choices || [], // @ts-ignore
          existingOption.choices || []
        )
      ) {
        return true;
      }
    }
    return false;
  };

  if (
    existingCommand.description !== localCommand.description ||
    existingCommand.options?.length !== (localCommand.options?.length || 0) ||
    areOptionsDifferent(existingCommand.options, localCommand.options || [])
  ) {
    return true;
  }

  return false;
};
