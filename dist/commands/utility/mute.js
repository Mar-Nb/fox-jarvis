import { PermissionFlagsBits, SlashCommandBuilder, SlashCommandNumberOption, SlashCommandStringOption, SlashCommandUserOption, } from "discord.js";
const userOption = new SlashCommandUserOption()
    .setName("membre")
    .setDescription("L'utilisateur à kick")
    .setRequired(true);
const stringOption = new SlashCommandStringOption()
    .setName("raison")
    .setDescription("La raison du kick")
    .setRequired(true);
const numberOption = new SlashCommandNumberOption()
    .setName("temps")
    .setDescription("La durée du silence")
    .setRequired(true);
export default {
    data: new SlashCommandBuilder()
        .setName("mute")
        .setDescription("Mute un membre du serveur")
        .addUserOption(userOption)
        .addStringOption(stringOption)
        .addNumberOption(numberOption)
        .setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers),
    async execute(interaction) {
        const member = interaction.options.getUser("membre");
        const reason = interaction.options.getString("raison") || "";
        const time = interaction.options.getNumber("temps") || 0;
        const guildMember = interaction.guild?.members.cache.get(member?.id || "");
        if (!guildMember) {
            await interaction.reply({
                ephemeral: true,
                content: `Le membre "${interaction.options.get("membre")}" n'est pas un membre de la guilde`,
            });
            return;
        }
        if (guildMember.isCommunicationDisabled()) {
            await interaction.reply({
                ephemeral: true,
                content: "Ce membre est déjà mute",
            });
            return;
        }
        try {
            await guildMember.timeout(time * 1000, reason);
            await interaction.reply(`${member?.tag} a été mute, pour la raison : ${reason}`);
        }
        catch (error) {
            console.error(error);
            await interaction.reply({
                ephemeral: true,
                content: "Une erreur est survenue pendant le mute: " + error,
            });
        }
    },
};
