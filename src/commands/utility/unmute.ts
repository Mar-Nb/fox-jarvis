import {
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  SlashCommandBuilder,
  SlashCommandStringOption,
  SlashCommandUserOption,
} from "discord.js";

const userOption = new SlashCommandUserOption()
  .setName("membre")
  .setDescription("L'utilisateur à unmute")
  .setRequired(true);

const stringOption = new SlashCommandStringOption()
  .setName("raison")
  .setDescription("Raison de l'unmute")
  .setRequired(false);

export default {
  data: new SlashCommandBuilder()
    .setName("unmute")
    .setDescription("Unmute un membre du serveur")
    .addUserOption(userOption)
    .addStringOption(stringOption)
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction: ChatInputCommandInteraction) {
    const member = interaction.options.getUser("membre");
    const reason = interaction.options.getString("raison");

    const guildMember = interaction.guild?.members.cache.get(member?.id || "");
    if (!guildMember) {
      await interaction.reply({
        ephemeral: true,
        content: `Le membre "${interaction.options.get("membre")}" n'est pas un membre de la guilde`,
      });
      return;
    }

    if (!guildMember.isCommunicationDisabled()) {
      await interaction.reply({
        ephemeral: true,
        content: "Ce membre n'est pas déjà mute",
      });
      return;
    }

    try {
      await guildMember.timeout(null, reason ?? "");
      await interaction.reply(
        `${member?.tag} a été unmute${reason && `, pour la raison : ${reason}`}`,
      );
    } catch (error) {
      console.error(error);
      await interaction.reply({
        ephemeral: true,
        content: "Une erreur est survenue pendant l'unmute: " + error,
      });
    }
  },
};
