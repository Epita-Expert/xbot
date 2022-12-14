const fs = require("fs");
const { Client, Collection, Intents } = require("discord.js");
const http = require("http");

http
  .createServer(function (req, res) {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.write("Server is up!");
    res.end();
  })
  .listen(8080);

const Sentry = require("@sentry/node");
// or use es6 import statements
// import * as Sentry from '@sentry/node';

const Tracing = require("@sentry/tracing");
// or use es6 import statements
// import * as Tracing from '@sentry/tracing';

Sentry.init({
  dsn: "https://68ae67a02fe841f5a91de311e164c92c@o1276905.ingest.sentry.io/6474117",

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILD_MEMBERS,
  ],
});
client.commands = new Map();
const approvedGuilds = process.env.SERVER_ID.split(",");

const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

const getApp = (guildId) => {
  const app = client.api.applications(client.user.id);
  if (guildId) {
    app.guilds(guildId);
  }
  return app;
};

client.once("ready", () => {
  //to delete specific command from guilds
  /*approvedGuilds.forEach( async guild => {
        const command = await client.guilds.cache.get(guild)?.commands.fetch();
        command.forEach(async cmd => {
            if (cmd.name == "zeus") {
                await client.guilds.cache.get(guild)?.commands.delete(cmd.id);
            }
        })
    })*/

  //pushing commands to the discord API
  client.commands.forEach(async (cmd) => {
    let command = undefined;
    if (cmd.isGlobal) {
      try {
        command = await client.application?.commands.create(cmd.data);
        if ("permissions" in cmd.data) {
          await command.permissions.set({ permissions: cmd.data.permissions });
        }
        console.log(
          '[1/1] - "' + cmd.data.name + '" is ready! (globally: all guilds)'
        );
      } catch (error) {
        console.error(error);
      }
    } else {
      let j = 1;
      await approvedGuilds.forEach(async (guild) => {
        if ("guilds" in cmd && cmd.guilds.indexOf(guild) === -1) {
          return;
        }
        try {
          command = await client.guilds.cache
            .get(guild)
            ?.commands.create(cmd.data);
          if ("permissions" in cmd.data && command) {
            await command.permissions.set({
              permissions: cmd.data.permissions,
            });
          }
          console.log(
            "[" +
              j++ +
              "/" +
              approvedGuilds.length +
              '] - "' +
              cmd.data.name +
              '" is ready! (locally: ' +
              guild +
              ")"
          );
        } catch (error) {
          //console.error(error);
          console.error("An error has been sent to Sentry");
          Sentry.captureException(error);
        }
      });
    }
    if (typeof cmd.init === "function") {
      cmd.init({ client: client });
    }
  });

  //caching AGENDA channel for reaction listener & MEMBERS
  approvedGuilds.forEach((guild) => {
    const server = client.guilds.cache.get(guild);
    if (server) {
      server.members.fetch();
      let agenda = server.channels.cache.find(
        (chan) => chan.name === "????-agenda"
      );
      if (agenda) {
        agenda.messages.fetch();
      } else {
        console.warn('No channel named "????-agenda" found in guild ' + guild);
      }
    }
  });

  console.log("Ready!");
});

client.on("interactionCreate", async (interaction) => {
  const cmdName = interaction.isButton()
    ? interaction.message.interaction.commandName
    : interaction.commandName;

  if (
    !interaction.isCommand() &&
    !interaction.isButton() &&
    !interaction.isContextMenu()
  )
    return;

  if (
    !client.commands.has(cmdName) ||
    (interaction.isButton() &&
      !(typeof client.commands.get(cmdName).callback === "function"))
  )
    return;

  try {
    if (interaction.isButton()) {
      await client.commands.get(cmdName).callback({
        user: interaction.member,
        interaction: interaction,
        channel: interaction.channel,
      });
    } else {
      await client.commands.get(cmdName).execute({
        options: interaction.options,
        channel: interaction.channel,
        user: interaction.user,
        client: client,
        interaction: interaction,
      });
    }
  } catch (error) {
    //console.error(error);
    console.error("An error has been sent to Sentry");
    Sentry.captureException(error);
    await interaction.reply({
      content:
        "Une erreur est survenue lors de l'ex??cution de cette commande !",
      ephemeral: true,
    });
  }
});

client.on("messageCreate", async (message) => {
  if (
    (message.mentions.users.has(client.user.id) ||
      message.content.indexOf("<@" + client.user.id + ">") > -1 ||
      message.content.indexOf("<@!" + client.user.id + ">") > -1) &&
    message.author.id != client.user.id
  )
    message.react("????");
});

client.login(process.env.TOKEN);
