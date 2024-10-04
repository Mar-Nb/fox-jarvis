import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Affiche la latence du bot"),

  async execute(interaction: ChatInputCommandInteraction) {
    const embed = new EmbedBuilder().setDescription(
      `Ping: ${interaction.client.ws.ping}`,
    );

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
