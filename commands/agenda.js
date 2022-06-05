const { MessageEmbed } = require("discord.js");

const { initDatabase, agendaSchema } = require("../models/agenda-schema");
const { Op } = require("@sequelize/core");

const annee = [];
let d = new Date();
y = d.getFullYear();
for (i = 0; i < 3; ++i) {
  annee.push({ name: (y + i).toString(), value: y + i });
}

const heure = [];
for (i = 0; i < 24; ++i) {
  heure.push({ name: ("0" + i).slice(-2), value: i });
}

const getAgenda = (guild) => {
  return guild.channels.cache.find((chan) => chan.name === "📅-agenda");
};

module.exports = {
  isGlobal: false,
  data: {
    name: "agenda",
    description:
      "Gestion des événements du salon Agenda, il est possible de s'abonner aux rappels des événements",
    options: [
      {
        name: "ajouter",
        description: "Ajoute un événement",
        type: "SUB_COMMAND",
        options: [
          {
            name: "nom",
            description: "Nom de l'événement",
            type: "STRING",
            required: true,
          },
          {
            name: "description",
            description: "Description de l'événement",
            type: "STRING",
            required: true,
          },
          {
            name: "jour",
            description: "Jour de l'événement (format JJ)",
            type: "INTEGER",
            required: true,
          },
          {
            name: "mois",
            description: "Mois de l'événement",
            type: "INTEGER",
            required: true,
            choices: [
              {
                name: "Janvier",
                value: 1,
              },
              {
                name: "Février",
                value: 2,
              },
              {
                name: "Mars",
                value: 3,
              },
              {
                name: "Avril",
                value: 4,
              },
              {
                name: "Mai",
                value: 5,
              },
              {
                name: "Juin",
                value: 6,
              },
              {
                name: "Juillet",
                value: 7,
              },
              {
                name: "Août",
                value: 8,
              },
              {
                name: "Septembre",
                value: 9,
              },
              {
                name: "Octobre",
                value: 10,
              },
              {
                name: "Novembre",
                value: 11,
              },
              {
                name: "Décembre",
                value: 12,
              },
            ],
          },
          {
            name: "annee",
            description: "Année de l'événement",
            type: "INTEGER",
            required: true,
            choices: annee,
          },
          {
            name: "heure",
            description: "(Optionnel) Heure de l'événement",
            type: "INTEGER",
            required: false,
            choices: heure,
          },
          {
            name: "minute",
            description: "(Optionnel) Minute de l'événement",
            type: "INTEGER",
            required: false,
          },
        ],
      },
      {
        name: "supprimer",
        description: "Supprime un événement (Spécifier un des deux paramètres)",
        type: "SUB_COMMAND",
        options: [
          {
            name: "nom",
            description: "Nom de l'événement",
            type: "STRING",
            required: false,
          },
          {
            name: "id_message",
            description:
              "Identifiant du message de l'événement (le paramètre 'nom' sera ignoré mais doit être renseigné)",
            type: "STRING",
            required: false,
          },
        ],
      },
      {
        name: "liste",
        description:
          "Affiche une liste des événements à venir dans le salon actuel",
        type: "SUB_COMMAND",
        options: [],
      },
    ],
  },
  init: async ({ client }) => {
    await initDatabase();

    const verifNotifs = async () => {
      const date14 = new Date();
      date14.setDate(date14.getDate() + 14);
      const date7 = new Date();
      date7.setDate(date7.getDate() + 7);
      const date2 = new Date();
      date2.setDate(date2.getDate() + 2);
      const date1 = new Date();
      date1.setDate(date1.getDate() + 1);
      const dateNow = new Date();

      const query14 = {
        [Op.and]: [
          {
            date: {
              [Op.lte]: date14.valueOf(),
              [Op.gt]: date7.valueOf(),
            },
          },
          {
            send14: false,
          },
        ],
      };
      const query7 = {
        [Op.and]: [
          {
            date: {
              [Op.lte]: date7.valueOf(),
              [Op.gt]: date2.valueOf(),
            },
          },
          {
            send7: false,
          },
        ],
      };
      const query2 = {
        [Op.and]: [
          {
            date: {
              [Op.lte]: date2.valueOf(),
              [Op.gt]: date1.valueOf(),
            },
          },
          {
            send2: false,
          },
        ],
      };
      const query1 = {
        [Op.and]: [
          {
            date: {
              [Op.lte]: date1.valueOf(),
              [Op.gt]: dateNow.valueOf(),
            },
          },
          {
            send1: false,
          },
        ],
      };
      const queries = {
        "2 semaines": query14,
        "1 semaine": query7,
        "48h": query2,
        "24h": query1,
      };
      let index = 0;
      let days = ["send14", "send7", "send2", "send1"];
      for (const [name, query] of Object.entries(queries)) {
        const events = await agendaSchema.findAll({ where: query });
        for (const event of events) {
          let userSent = 0;
          const date = event.date;
          const [heure, minute, seconde] = date
            .toLocaleTimeString("fr-FR")
            .split(":");
          const temps = parseInt(heure, 10)
            ? " à " +
              (parseInt(minute, 10) ? heure + ":" + minute : heure + "h") +
              " "
            : "";
          let subCount = event.subscribers.filter((e) => e).length;
          event.subscribers
            .filter((e) => e)
            .forEach(async (user) => {
              let guildUser = await client.guilds.cache.get(event.guildId);
              let discordUser = guildUser.members.cache.get(user);
              if (discordUser) {
                const embed = new MessageEmbed()
                  .setTitle(
                    '"' +
                      event.name +
                      '" dans ' +
                      name +
                      " - " +
                      date.toLocaleDateString("fr-FR") +
                      temps
                  )
                  .setDescription(
                    event.description || "Aucune description de l'événement"
                  )
                  .setAuthor("🔔 RAPPEL")
                  .setColor("#6d99d3");
                embed.setFooter(
                  "🔔 Clique sur la cloche sous cet événement dans le salon agenda pour ne plus recevoir de rappels par message privé."
                );
                discordUser.send({ embeds: [embed] });
                ++userSent;
              }
            });
          let updateField = days[index];
          await agendaSchema.update(
            { [updateField]: true },
            {
              where: {
                [Op.and]: [
                  {
                    msgId: event.msgId,
                  },
                  {
                    channelId: event.channelId,
                  },
                ],
              },
            }
          );
          console.log(
            'Reminder sent for "' +
              event.name +
              '" (' +
              name +
              ") - " +
              userSent +
              "/" +
              subCount
          );
        }
        ++index;
      }

      setTimeout(verifNotifs, 10000);
    };

    verifNotifs();

    client.on("messageReactionAdd", async (reaction, user) => {
      const agendaChannel = getAgenda(reaction.message.channel.guild);
      if (agendaChannel && reaction.message.channel.id === agendaChannel.id) {
        if (reaction._emoji.name == "🔔" && !user.bot) {
          await agendaSchema
            .findOne({
              where: {
                msgId: reaction.message.id,
                channelId: reaction.message.channel.id,
              },
            })
            .then((event) => {
              if (event) {
                let subs = [...event.subscribers, user.id].filter((e) => e);
                event.update({
                  subscribers: subs,
                });
                console.log(
                  user.username + ' subscribe to "' + event.name + '"'
                );
                let dateNow = new Date();
                let embed = null;
                if (dateNow > event.date) {
                  embed = new MessageEmbed()
                    .setTitle(
                      "Abonnement à l'événement \"" +
                        event.name +
                        '" pris en compte'
                    )
                    .setDescription(
                      "Attention il semblerait que cet événement est déjà passé, tu ne receveras donc pas de rappels pour celui-ci."
                    )
                    .setAuthor("🔔 Notifications xBot")
                    .setColor("#6d99d3");
                } else {
                  embed = new MessageEmbed()
                    .setTitle(
                      "Abonnement à l'événement \"" +
                        event.name +
                        '" pris en compte'
                    )
                    .setDescription(
                      "Tu receveras un rappel 2 semaines, 1 semaine, 48h et 24h avant l'événement par message privé."
                    )
                    .setAuthor("🔔 Notifications xBot")
                    .setColor("#6d99d3");
                }
                reaction.message.guild.members.cache
                  .find((member) => member.id === user.id)
                  .send({ embeds: [embed] });
              } else {
                reaction.remove();
              }
            });
        }
      }
    });

    client.on("messageReactionRemove", async (reaction, user) => {
      const agendaChannel = getAgenda(reaction.message.channel.guild);
      if (agendaChannel && reaction.message.channel.id === agendaChannel.id) {
        if (reaction._emoji.name == "🔔" && !user.bot) {
          await agendaSchema
            .findOne({
              where: {
                msgId: reaction.message.id,
                channelId: reaction.message.channel.id,
              },
            })
            .then((event) => {
              if (event) {
                let subs = event.subscribers.filter((e) => e !== user.id);
                event.update({
                  subscribers: subs,
                });
                console.log(
                  user.username + ' unsubscribe from "' + event.name + '"'
                );
                const embed = new MessageEmbed()
                  .setTitle(
                    "Désabonnement de l'événement \"" +
                      event.name +
                      '" pris en compte'
                  )
                  .setDescription(
                    "Tu ne receveras plus aucun rappel par message privé pour cet événement."
                  )
                  .setAuthor("🔔 Notifications xBot")
                  .setColor("#6d99d3");
                reaction.message.guild.members.cache
                  .find((member) => member.id === user.id)
                  .send({ embeds: [embed] });
              }
            });
        }
      }
    });
  },
  execute: async ({ interaction, channel, options }) => {
    const agendaChannel = getAgenda(channel.guild);
    if (!agendaChannel) {
      await interaction.reply({
        content:
          "Aucun salon xBot agenda n'existe sur ce serveur. Créé-le ou demande à un administrateur de le créer. Le nom du salon doit être le suivant :```📅-agenda```",
        ephemeral: true,
      });
      return;
    }
    if (options.getSubcommand() === "ajouter") {
      let opt_annee = options.getInteger("annee");
      let opt_mois = options.getInteger("mois");
      let opt_jour = options.getInteger("jour");
      let opt_heure = options.getInteger("heure");
      let opt_minute = options.getInteger("minute");
      if (
        ([1, 3, 5, 7, 8, 10, 12].indexOf(opt_mois) != -1 && opt_jour > 31) ||
        ([4, 6, 9, 11].indexOf(opt_mois) != -1 && opt_jour > 30) ||
        (opt_mois === 2 && opt_jour > 29) ||
        opt_jour < 1
      ) {
        await interaction.reply({
          content: "Le jour sélectionné est invalide. Merci de réessayer.",
          ephemeral: true,
        });
        return;
      }
      opt_minute = opt_minute || 0;
      if (opt_minute >= 60 || opt_minute < 0) {
        await interaction.reply({
          content:
            "Les minutes doivent être entre 0 et 59. Merci de réessayer.",
          ephemeral: true,
        });
        return;
      }

      const date =
        ("0" + opt_jour).slice(-2) +
        "/" +
        ("0" + opt_mois).slice(-2) +
        "/" +
        opt_annee;
      const heure = opt_heure
        ? " à " +
          (("0" + opt_minute).slice(-2)
            ? ("0" + opt_heure).slice(-2) + ":" + ("0" + opt_minute).slice(-2)
            : ("0" + opt_heure).slice(-2) + "h") +
          " "
        : "";
      const nom = options.getString("nom");
      const description = options.getString("description");

      const embed = new MessageEmbed()
        .setTitle(date + heure + " - " + nom)
        .setDescription(description)
        .setAuthor("📅 À venir")
        .setColor("#6d99d3");

      embed.setFooter(
        "🔔 Clique sur la cloche pour recevoir un rappel 2 semaines, 1 semaine, 48h et 24h avant l'événement par message privé."
      );

      const datedb = new Date(
        opt_annee +
          "-" +
          ("0" + opt_mois).slice(-2) +
          "-" +
          ("0" + opt_jour).slice(-2) +
          "T" +
          (opt_heure
            ? (("0" + opt_minute).slice(-2)
                ? ("0" + opt_heure).slice(-2) +
                  ":" +
                  ("0" + opt_minute).slice(-2)
                : ("0" + opt_heure).slice(-2) + ":00") + ":00"
            : "00:00:00")
      );

      agendaChannel.send({ embeds: [embed] }).then((sentEmbed) => {
        sentEmbed.react("🔔");
        agendaSchema.create({
          date: datedb.valueOf(),
          msgId: sentEmbed.id,
          channelId: agendaChannel.id,
          guildId: channel.guild.id,
          name: nom,
          description: description,
        });
      });

      await interaction.reply({
        content:
          "L'événement a bien été ajouté dans <#" +
          agendaChannel.id +
          ">. Tu peux t'abonner aux rappels en cliquant sur :bell: sous l'événement.",
      });
      return;
    } else if (options.getSubcommand() === "supprimer") {
      if (options.getString("nom") && !options.getString("id_message")) {
        const events = await agendaSchema.findAll({
          where: { name: options.getString("nom") },
        });
        if (events.length === 1) {
          const event = events[0];
          let success = false;
          await agendaSchema
            .destroy({ where: { msgId: event.msgId } })
            .then(() => {
              success = true;
              agendaChannel.messages
                .fetch(event.msgId)
                .then((message) => message.delete());
            });
          await interaction.reply({
            content: success
              ? "L'événement a bien été supprimé de <#" +
                agendaChannel.id +
                ">."
              : "Erreur lors de la suppression",
          });
          return;
        } else if (events.length === 0) {
          await interaction.reply({
            content: "Aucun événement trouvé avec ce nom.",
            ephemeral: true,
          });
          return;
        } else {
          await interaction.reply({
            content:
              "Le nom de cet événement est ambigu, merci de préciser l'identifiant du message à la place.",
            ephemeral: true,
          });
          return;
        }
      } else if (options.getString("id_message")) {
        let success = false;
        const id_msg = options.getString("id_message");
        await agendaSchema.destroy({ where: { msgId: id_msg } }).then(() => {
          success = true;
          agendaChannel.messages
            .fetch(id_msg)
            .then((message) => message.delete());
        });
        await interaction.reply({
          content: success
            ? "L'événement a bien été supprimé de <#" + agendaChannel.id + ">."
            : "Erreur lors de la suppression",
        });
        return;
      } else {
        await interaction.reply({
          content: "Merci de renseigner un des deux paramètres.",
          ephemeral: true,
        });
        return;
      }
    } else if (options.getSubcommand() === "liste") {
      const dateNow = new Date();
      const events = await agendaSchema.findAll({
        where: {
          date: { [Op.gt]: dateNow.valueOf() },
          guildId: channel.guild.id,
        },
        order: [["date", "ASC"]],
      });
      const embed = new MessageEmbed()
        .setTitle("Résumé des événements")
        .setAuthor("📅 À venir")
        .setColor("#6d99d3");
      if (events.length) {
        events.forEach((e) => {
          const date = e.date;
          const [heure, minute, seconde] = date
            .toLocaleTimeString("fr-FR")
            .split(":");
          const temps = parseInt(heure, 10)
            ? " à " +
              (parseInt(minute, 10) ? heure + ":" + minute : heure + "h") +
              " "
            : "";
          embed.addField(
            date.toLocaleDateString("fr-FR") + temps + " - " + e.name,
            e.description || "-"
          );
        });
      } else {
        embed.setDescription("Aucun événement à venir.");
      }
      await interaction.reply({
        content:
          channel.id === agendaChannel.id
            ? "Explore ce salon pour voir le détail des événements et t'abonner aux rappels."
            : "Explore <#" +
              agendaChannel.id +
              "> pour voir le détail des événements et t'abonner aux rappels.",
        embeds: [embed],
      });
      return;
    }
    throw "Erreur lors de l'exécution de la commande agenda";
  },
};
