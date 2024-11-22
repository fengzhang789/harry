import { REST, Routes, Client, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";

dotenv.config();

const commands = [
  {
    name: "ping",
    description: "Replies with Pong!",
  },
];

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

try {
  console.log("Started refreshing application (/) commands.");

  await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
    body: commands,
  });

  console.log("Successfully reloaded application (/) commands.");
} catch (error) {
  console.error(error);
  console.log("not gaming");
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
  ],
});

function respondToGaming(message) {
  const actions = [
    () => message.channel.send("gotta game"),
    () => message.channel.send("just game"),
    () => message.react("<:finance_exec_harry_wang:1306807805432303736>"),
    () => message.react("<:chillygame:1299821740154949672>"),
    () => message.channel.send({ stickers: ["1309038970344312904"] }),
  ];
  const randIndex = Math.floor(Math.random() * actions.length);
  const chosenAction = actions[randIndex];

  console.log(`Responding with action ${randIndex}`);
  chosenAction();
}

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("messageCreate", (message) => {
  // Ignore messages from the bot itself
  if (message.author.bot) return;

  // Respond to gaming
  const content = message.content;
  const triggerWords = ["gaming", "game"];
  const responseProbability = 0.1;
  if (triggerWords.some((w) => content.toLowerCase().includes(w))) {
    if (Math.random() < responseProbability) {
      respondToGaming(message);
    }
  }
});

client.on("messageReactionAdd", (reaction, user) => {
  if (reaction.bot) return;

  if (reaction.emoji.name === "finance_exec_harry_wang") {
    respondToGaming(reaction.message);
  }
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "ping") {
    await interaction.reply("Pong!");
  }
});

client.login(process.env.TOKEN);
