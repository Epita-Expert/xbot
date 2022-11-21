import { Logger } from '@nestjs/common';
import {
  InteractionResponseType,
  InteractionResponseFlags,
} from 'discord-interactions';
import { DiscordService } from 'src/discord/discord.service';
import { InteractionResponse, EmbedType } from 'src/utils';
import { CommandService } from './commands.interface';

export class AgendaCommand implements CommandService {
  private readonly logger = new Logger(AgendaCommand.name);

  constructor(private readonly discordService: DiscordService) {}

  async execute({ data, channel_id }): Promise<InteractionResponse> {
    const channels = await this.discordService.getChannels();
    const agendaChannel = channels.find((c) => c.name === 'general');
    // console.log(body);
    console.log(agendaChannel);

    if (!agendaChannel) {
      return {
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content:
            "Aucun salon agenda n'existe sur ce serveur. Créé-le ou demande à un administrateur de le créer. Le nom du salon doit être le suivant :```📅-agenda```",
          flags: InteractionResponseFlags.EPHEMERAL,
        },
      };
    }

    const option = data.options[0];
    console.log(option);

    switch (option.name) {
      case 'lister':
        return await this.listEvents({ channel_id, agendaChannel });
      case 'ajouter':
        return await this.addEvent({
          channel_id,
          data: option.options,
        });
      // case 'supprimer':
      //   return await this.deleteEvent({ channel_id, agendaChannel, data });
      default:
        throw new Error('Invalid option');
    }
  }

  private async deleteEvent(arg0: { channel_id: any; data: any }) {
    //   if (options.getString('nom') && !options.getString('id_message')) {
    //     const events = await agendaSchema.findAll({
    //       where: { name: options.getString('nom') },
    //     });
    //     if (events.length === 1) {
    //       const event = events[0];
    //       let success = false;
    //       await agendaSchema
    //         .destroy({ where: { msgId: event.msgId } })
    //         .then(() => {
    //           success = true;
    //           agendaChannel.messages
    //             .fetch(event.msgId)
    //             .then((message) => message.delete());
    //         });
    //       await interaction.reply({
    //         content: success
    //           ? "L'événement a bien été supprimé de <#" +
    //             agendaChannel.id +
    //             '>.'
    //           : 'Erreur lors de la suppression',
    //       });
    //       return;
    //     } else if (events.length === 0) {
    //       await interaction.reply({
    //         content: 'Aucun événement trouvé avec ce nom.',
    //         ephemeral: true,
    //       });
    //       return;
    //     } else {
    //       await interaction.reply({
    //         content:
    //           "Le nom de cet événement est ambigu, merci de préciser l'identifiant du message à la place.",
    //         ephemeral: true,
    //       });
    //       return;
    //     }
    //   } else if (options.getString('id_message')) {
    //     let success = false;
    //     const id_msg = options.getString('id_message');
    //     await agendaSchema.destroy({ where: { msgId: id_msg } }).then(() => {
    //       success = true;
    //       agendaChannel.messages
    //         .fetch(id_msg)
    //         .then((message) => message.delete());
    //     });
    //     await interaction.reply({
    //       content: success
    //         ? "L'événement a bien été supprimé de <#" +
    //           agendaChannel.id +
    //           '>.'
    //         : 'Erreur lors de la suppression',
    //     });
    //     return;
    //   } else {
    //     await interaction.reply({
    //       content: 'Merci de renseigner un des deux paramètres.',
    //       ephemeral: true,
    //     });
    //     return;
    //   }
  }
  private async addEvent(arg0: { channel_id: any; data: any }) {
    const { channel_id, data } = arg0;
    const options = data.reduce((acc, option) => {
      acc[option.name] = option.value;
      return acc;
    }, {});
    const opt_annee = options.annee;
    const opt_mois = options.mois;
    const opt_jour = options.jour;
    const opt_heure = options.heure;
    let opt_minute = options.minute;
    if (
      ([1, 3, 5, 7, 8, 10, 12].indexOf(opt_mois) != -1 && opt_jour > 31) ||
      ([4, 6, 9, 11].indexOf(opt_mois) != -1 && opt_jour > 30) ||
      (opt_mois === 2 && opt_jour > 29) ||
      opt_jour < 1
    ) {
      return {
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: "Le jour renseigné n'existe pas.",
          flags: InteractionResponseFlags.EPHEMERAL,
        },
      };
    }
    opt_minute = opt_minute || 0;
    if (opt_minute >= 60 || opt_minute < 0) {
      return {
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: "La minute renseignée n'existe pas.",
          flags: InteractionResponseFlags.EPHEMERAL,
        },
      };
    }
    const date =
      ('0' + opt_jour).slice(-2) +
      '/' +
      ('0' + opt_mois).slice(-2) +
      '/' +
      opt_annee;
    const heure = opt_heure
      ? ' à ' +
        (('0' + opt_minute).slice(-2)
          ? ('0' + opt_heure).slice(-2) + ':' + ('0' + opt_minute).slice(-2)
          : ('0' + opt_heure).slice(-2) + 'h') +
        ' '
      : '';

    const message = await this.discordService.createMessage(channel_id, {
      embeds: [
        {
          title: date + heure + ' - ' + options.nom,
          description: options.description,
          author: {
            name: '📅 À venir',
          },
          color: 0x6d99d3,
          footer: {
            text: "🔔 Clique sur 🔔 pour recevoir un rappel 2 semaines, 1 semaine, 48h et 24h avant l'événement par message privé.",
          },
        },
      ],
    });
    await this.discordService.createReaction(channel_id, message.id, '🔔');

    // create event in db

    return {
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content:
          "L'événement a bien été ajouté dans <#" +
          channel_id +
          ">. Tu peux t'abonner aux rappels en cliquant sur :bell: sous l'événement.",
      },
    };
  }

  private async listEvents({
    channel_id,
    agendaChannel,
  }): Promise<InteractionResponse> {
    const events = [];
    this.logger.log('Fetching events');
    // await agendaSchema.findAll({
    //   where: {
    //     date: { [Op.gt]: dateNow.valueOf() },
    //     guildId: channel.guild.id,
    //   },
    //   order: [['date', 'ASC']],
    // });

    return {
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content:
          channel_id === agendaChannel.id
            ? "Explore ce salon pour voir le détail des événements et t'abonner aux rappels."
            : `Explore <#'${agendaChannel.id}'> pour voir le détail des événements et t'abonner aux rappels.`,
        embeds: [
          {
            title: 'Résumé des événements',
            type: EmbedType.rich,
            author: {
              name: '📅 À venir',
            },
            color: 0x6d99d3,
            description: events.length ? null : 'Aucun événement à venir.',
            fields: events.length
              ? events.map((e) => {
                  const date = e.date;
                  const [heure, minute] = date
                    .toLocaleTimeString('fr-FR')
                    .split(':');
                  const temps = parseInt(heure, 10)
                    ? ' à ' +
                      (parseInt(minute, 10)
                        ? heure + ':' + minute
                        : heure + 'h') +
                      ' '
                    : '';
                  return {
                    name:
                      date.toLocaleDateString('fr-FR') + temps + ' - ' + e.name,
                    value: e.description || '-',
                  };
                })
              : null,
          },
        ],
        flags: InteractionResponseFlags.EPHEMERAL,
      },
    };
  }
}
