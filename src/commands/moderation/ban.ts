import {
  ApplicationCommandOptionType,
  Client,
  CommandInteraction,
  GuildMemberRoleManager,
  PermissionFlagsBits,
} from "discord.js";

module.exports = {
  name: "ban",
  description: "Bans a member from the server.",
  devOnly: true,
  // testOnly: Boolean,
  options: [
    {
      name: "target-user",
      description: "The user to ban",
      required: true,
      type: ApplicationCommandOptionType.Mentionable,
    },
    {
      name: "reason",
      description: "Reason for banning",
      type: ApplicationCommandOptionType.String,
    },
  ],
  permissionsRequired: [PermissionFlagsBits.BanMembers],
  botPermissions: [PermissionFlagsBits.BanMembers],
  callback: async (client: Client, interaction: CommandInteraction) => {
    const targetUserId = interaction.options.get("target-user")!
      .value as string;
    const reason =
      (interaction.options.get("reason")?.value as string) ||
      "No reason provided";

    await interaction.deferReply();
    const targetUser = await interaction.guild?.members.fetch(targetUserId);
    if (!targetUser) {
      await interaction.editReply("That user does not exist in this server");
      return;
    }
    if (targetUser.id === interaction.guild?.ownerId) {
      await interaction.editReply("You can't ban the server owner");
      return;
    }

    const targetUserRolePosition = targetUser.roles.highest.position;
    const requestUserRolePosition = (
      interaction.member?.roles as GuildMemberRoleManager
    ).highest.position;
    const botRolePosition = (
      interaction.guild?.members.me?.roles as GuildMemberRoleManager
    ).highest.position;

    if (targetUserRolePosition >= requestUserRolePosition) {
      await interaction.editReply("That user has higher permissions than you.");
      return;
    }
    if (targetUserRolePosition >= botRolePosition) {
      await interaction.editReply("That user has higher permissions than me.");
      return;
    }

    try {
      await targetUser.ban({ reason });
      await interaction.editReply(
        `User ${targetUser} was banned\nReason: ${reason}`
      );
    } catch (error) {
      console.log(`There was an error when banning`);
    }
  },
};
