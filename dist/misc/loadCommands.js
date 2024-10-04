import dotenv from "dotenv";
import { REST, Routes } from "discord.js";
dotenv.config();
const commands = [
    {
        name: "ping",
        description: "Affiche la latence du bot",
    },
];
const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);
try {
    console.log("Started refreshing application (/) commands.");
    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
        body: commands,
    });
    console.log("Successfully reloaded application (/) commands.");
}
catch (error) {
    console.log(error);
}
