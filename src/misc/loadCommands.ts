import dotenv from "dotenv";
import { REST, Routes } from "discord.js";

dotenv.config();

interface SlashCommand {
  name: string;
  description: string;
}

const commands: SlashCommand[] = [
  {
    name: "ping",
    description: "Affiche la latence du bot",
  },
  {
    name: "kick",
    description: "Kick un membre du serveur",
  },
];

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

try {
  console.log("Started refreshing application (/) commands.");

  await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
    body: commands,
  });

  console.log("Successfully reloaded application (/) commands.");
} catch (error) {
  console.log(error);
}
