import {
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  SlashCommandBuilder,
  SlashCommandChannelOption,
  SlashCommandNumberOption,
  TextChannel,
} from "discord.js";

const numberOption = new SlashCommandNumberOption()
  .setName("nombre")
  .setDescription("Nombre de messages à supprimer")
  .setRequired(true);

const channelOption = new SlashCommandChannelOption()
  .setName("canal")
  .setDescription("Le nom du canal concerné")
  .setRequired(false);

export default {
  data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription(
      "Supprime les derniers messages du canal spécifié (ou du canal courant sinon)",
    )
    .addNumberOption(numberOption)
    .addChannelOption(channelOption)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  async execute(interaction: ChatInputCommandInteraction) {
    const numberToDelete = interaction.options.getNumber("nombre");
    const channel =
      interaction.options.getChannel("canal") ?? interaction.channel;

    if (!numberToDelete) {
      await interaction.reply({
        ephemeral: true,
        content: "Un nombre de message à supprimer doit être spécifié",
      });
      return;
    }

    if (!channel || !(channel instanceof TextChannel)) {
      await interaction.reply({
        ephemeral: true,
        content: "Cette commande ne peut fonctionner que dans un canal textuel",
      });
      return;
    }

    await interaction.deferReply({ ephemeral: true });

    try {
      if (numberToDelete > 100) {
        throw new Error("Can't delete more than 100 messages in a row");
      }

      const deletedMessages = await channel.bulkDelete(numberToDelete);
      await interaction.editReply(
        `Vous avez bien supprimé ${deletedMessages.size} du channel ${channel.name}`,
      );
    } catch (error) {
      console.error(error);
      await interaction.editReply(
        `Erreur lors de la suppression, il n'est pas possible de supprimer les messages plus vieux que 14 jours (erreur: ${error})`,
      );
    }
  },
};
