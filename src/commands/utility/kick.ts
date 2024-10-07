import {
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  SlashCommandBuilder,
  SlashCommandStringOption,
  SlashCommandUserOption,
} from "discord.js";

const userOption = new SlashCommandUserOption()
  .setName("membre")
  .setDescription("L'utilisateur à kick")
  .setRequired(true);

const stringOption = new SlashCommandStringOption()
  .setName("raison")
  .setDescription("La raison du kick")
  .setRequired(true);

export default {
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Kick un membre du serveur")
    .addUserOption(userOption)
    .addStringOption(stringOption)
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

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

    if (!guildMember.kickable) {
      await interaction.reply({
        ephemeral: true,
        content:
          "Impossible de kick cet utilisateur, il y a peut-être un problème de droit",
      });
      return;
    }

    try {
      await guildMember.kick(reason || "");
      await guildMember.send(
        `Vous avez été kick du serveur ${interaction.guild?.name} pour la raison : ${reason}`,
      );
      await interaction.reply(
        `${member?.tag} a été expulsé, pour la raison : ${reason}`,
      );
    } catch (error) {
      console.error(error);
      await interaction.reply({
        ephemeral: true,
        content: "Une erreur est survenue pendant le kick",
      });
    }
  },
};
