import dotenv from "dotenv";
dotenv.config();

import {
  Client,
  Collection,
  Events,
  GatewayIntentBits,
  Message,
  TextChannel,
} from "discord.js";
import { Command } from "./types/Command.js";
import ping from "./commands/utility/ping.js";
import kick from "./commands/utility/kick.js";
import mute from "./commands/utility/mute.js";
import unmute from "./commands/utility/unmute.js";
import clear from "./commands/utility/clear.js";
import { rewriteLink } from "./services/linkRewriter.js";

// Augment the type of Client with the "commands" property, to ease its transmission
declare module "discord.js" {
  interface Client {
    commands: Collection<string, Command>;
  }
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.commands = new Collection();
client.commands.set(ping.data.name, ping);
client.commands.set(kick.data.name, kick);
client.commands.set(mute.data.name, mute);
client.commands.set(unmute.data.name, unmute);
client.commands.set(clear.data.name, clear);

client.once(Events.ClientReady, (clientReady) => {
  console.log(`Logged in as ${clientReady.user.tag}!`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) {
    return;
  }

  const command = interaction.client.commands.get(interaction.commandName);
  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    }
  }
});

client.on(Events.MessageCreate, async (message: Message) => {
  if (message.author.bot) {
    return;
  }

  const containsLinkRegex =
    /(https?:\/\/)?(www\.)?[\w-]+\.[a-z]+(\/[\w-./?%&=]*)?/i;

  if (message.content.match(containsLinkRegex)) {
    const rewritedLink = rewriteLink(message.content);

    if (rewritedLink) {
      const author = message.author;
      await message.delete();
      await (message.channel as TextChannel).send({
        content: `${author} a partagé un lien : ${rewritedLink}`,
        allowedMentions: { users: [] },
      });
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
