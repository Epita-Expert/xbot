import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  InteractionType,
  InteractionResponseType,
  InteractionResponseFlags,
  MessageComponentTypes,
  ButtonStyleTypes,
} from 'discord-interactions';
import { DiscordService } from 'src/discord/discord.service';
import { NeogeolocService } from 'src/neogeoloc/neogeoloc.service';
import {
  capitalize,
  EmbedType,
  getRandomEmoji,
  getRPSChoices,
  GuildCommandEvent,
  InteractionResponse,
  RPSChoices,
  Event,
  EventEntityType,
  EventPrivacyLevel,
} from '../utils';
// Store for in-progress games. In production, you'd want to use a DB
const activeGames = {};
@Injectable()
export class InteractionsService {
  private readonly logger = new Logger(InteractionsService.name);
  constructor(
    private readonly discordService: DiscordService,
    private readonly neogeolocService: NeogeolocService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  public getCommands() {
    return this.discordService.getGuildCommands();
  }

  public async getInteractions(body: any): Promise<InteractionResponse> {
    // Interaction type and data
    const { type } = body;
    this.logger.log(`Received interaction of type ${type}`);

    switch (type) {
      case InteractionType.PING:
        return await this.handleInteractionTypePing();
      case InteractionType.APPLICATION_COMMAND:
        return await this.handleInteractionTypeApplicationCommand(body);
      case InteractionType.MESSAGE_COMPONENT:
        return this.handleInteractionTypeMessageComponent(body);
      default:
        return;
    }
  }

  private getResult(p1, p2) {
    let gameResult;
    if (RPSChoices[p1.objectName] && RPSChoices[p1.objectName][p2.objectName]) {
      // o1 wins
      gameResult = {
        win: p1,
        lose: p2,
        verb: RPSChoices[p1.objectName][p2.objectName],
      };
    } else if (
      RPSChoices[p2.objectName] &&
      RPSChoices[p2.objectName][p1.objectName]
    ) {
      // o2 wins
      gameResult = {
        win: p2,
        lose: p1,
        verb: RPSChoices[p2.objectName][p1.objectName],
      };
    } else {
      // tie -- win/lose don't
      gameResult = { win: p1, lose: p2, verb: 'tie' };
    }

    return this.formatResult(gameResult);
  }

  private formatResult(result) {
    const { win, lose, verb } = result;
    return verb === 'tie'
      ? `<@${win.id}> and <@${lose.id}> draw with **${win.objectName}**`
      : `<@${win.id}>'s **${win.objectName}** ${verb} <@${lose.id}>'s **${lose.objectName}**`;
  }

  // Function to fetch shuffled options for select menu
  private getShuffledOptions() {
    const allChoices = getRPSChoices();
    const options = [];

    for (const c of allChoices) {
      // Formatted for select menus
      // https://discord.com/developers/docs/interactions/message-components#select-menu-object-select-option-structure
      options.push({
        label: capitalize(c),
        value: c.toLowerCase(),
        description: RPSChoices[c]['description'],
      });
    }

    return options.sort(() => Math.random() - 0.5);
  }

  // @OnEvent(GuildCommandEvents.TEST)
  // handleGuildComandTestEvent() {
  //   return {
  //     type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
  //     data: {
  //       // Fetches a random emoji to send from a helper function
  //       content: 'hello world ' + getRandomEmoji(),
  //     },
  //   };
  // }

  /**
   * Handle verification requests
   */
  private async handleInteractionTypePing() {
    return {
      type: InteractionResponseType.PONG,
    };
  }

  /**
   * Handle requests from interactive components
   * See https://discord.com/developers/docs/interactions/message-components#responding-to-a-component-interaction
   */
  private async handleInteractionTypeMessageComponent(body: any) {
    const { data } = body;
    // custom_id set in payload when sending message component
    const componentId = data.custom_id;

    if (componentId.startsWith('accept_button_')) {
      // get the associated game ID
      const gameId = componentId.replace('accept_button_', '');
      try {
        // Delete previous message
        await this.discordService.deleteMessage(body);
        return {
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            // Fetches a random emoji to send from a helper function
            content: 'What is your object of choice?',
            // Indicates it'll be an ephemeral message
            flags: InteractionResponseFlags.EPHEMERAL,
            components: [
              {
                type: MessageComponentTypes.ACTION_ROW,
                components: [
                  {
                    type: MessageComponentTypes.STRING_SELECT,
                    // Append game ID
                    custom_id: `select_choice_${gameId}`,
                    options: this.getShuffledOptions(),
                  },
                ],
              },
            ],
          },
        };
      } catch (err) {
        console.error('Error sending message:', err.message);
      }
    } else if (componentId.startsWith('select_choice_')) {
      // get the associated game ID
      const gameId = componentId.replace('select_choice_', '');

      if (activeGames[gameId]) {
        // Get user ID and object choice for responding user
        const userId = body.member.user.id;
        const objectName = data.values[0];
        // Calculate result from helper function
        const resultStr = this.getResult(activeGames[gameId], {
          id: userId,
          objectName,
        });

        // Remove game from storage
        delete activeGames[gameId];
        try {
          await this.discordService.deleteMessage({
            content: 'Nice choice ' + getRandomEmoji(),
            components: [],
          });
          // Send results
          return {
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: { content: resultStr },
          };
        } catch (err) {
          console.error('Error sending message:', err.message);
        }
      }
    }
  }

  /**
   * Handle slash command requests
   * See https://discord.com/developers/docs/interactions/application-commands#slash-commands
   */
  private async handleInteractionTypeApplicationCommand(
    body,
  ): Promise<InteractionResponse> {
    const { id, data, channel_id } = body;
    const { name } = data;

    this.logger.log(`Received ${name} command`);

    // "test" guild command
    if (name === 'test') {
      // this.eventEmitter.emit(GuildCommandEvents.TEST);
      // Send a message into the channel where command was triggered from
      return {
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          // Fetches a random emoji to send from a helper function
          content: 'hello world ' + getRandomEmoji(),
        },
      };
    }

    if (name === GuildCommandEvent.STATUS) {
      // let statut = options.getString('message');
      // let type = options.getString('type');
      // if (statut.length <= 64) {
      //   client.user.setActivity(statut, { type: type });
      //   return {
      //     type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      //     data: {
      //       flags: InteractionResponseFlags.EPHEMERAL,
      //       content: 'Tu as modifié le statut du bot.',
      //     },
      //   };
      // } else {
      //   throw 'status string is too long (more than 64 characters)';
      // }
    }

    // "challenge" guild command
    if (name === GuildCommandEvent.CHALLENGE && id) {
      const { options } = data;

      const userId = body.member.user.id;
      // User's object choice
      const objectName = options[0].value;

      // Create active game using message ID as the game ID
      activeGames[id] = {
        id: userId,
        objectName,
      };

      return {
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          // Fetches a random emoji to send from a helper function
          content: `Rock papers scissors challenge from <@${userId}>`,
          components: [
            {
              type: MessageComponentTypes.ACTION_ROW,
              components: [
                {
                  type: MessageComponentTypes.BUTTON,
                  // Append the game ID to use later on
                  custom_id: `accept_button_${body.id}`,
                  label: 'Accept',
                  style: ButtonStyleTypes.PRIMARY,
                },
              ],
            },
          ],
        },
      };
    }

    if (name === GuildCommandEvent.AGENDA) {
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

    if (name === GuildCommandEvent.EVENT) {
      const option = data.options[0];
      const params = option.options.reduce((acc, option) => {
        acc[option.name] = option.value;
        return acc;
      }, {});

      const start_date = new Date(
        params.annee + '-' + params.mois + '-' + params.jour,
      );
      const end_date = new Date(
        params.annee + '-' + params.mois + '-' + params.jour,
      );
      const start_time = params.heure_debut.split(':');
      const end_time = params.heure_fin.split(':');
      start_date.setHours(start_time[0], start_time[1]);
      end_date.setHours(end_time[0], end_time[1]);

      const event: Event = {
        name: params.nom,
        description: params.description,
        entity_metadata: {
          location: params.emplacement,
        },
        entity_type: EventEntityType.ETERNAL,
        scheduled_end_time: end_date.toISOString(),
        scheduled_start_time: start_date.toISOString(),
        privacy_level: EventPrivacyLevel.GUILD_ONLY,
      };
      console.log(event);
      await this.discordService.createEvent(event);
      return {
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: "L'événement a bien été ajouté",
          flags: InteractionResponseFlags.EPHEMERAL,
        },
      };
    }

    if (name === GuildCommandEvent.NEOGEOLOC) {
      console.log(data.options[0].value);
      const response = await this.neogeolocService.postFakeLocation(
        data.options[0].value,
      );
      if (response.response === 'success') {
        return {
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: 'Vous avez bien été geolocalisé',
            flags: InteractionResponseFlags.EPHEMERAL,
          },
        };
      }

      return {
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: `Erreur lors de la géolocalisation: ${response.response}`,
          flags: InteractionResponseFlags.EPHEMERAL,
        },
      };
    }

    if (name === GuildCommandEvent.PING) {
      return this.pingEvent();
    }

    return this.unknownEvent();
  }

  private async unknownEvent(): Promise<InteractionResponse> {
    const list = await this.discordService.getGuildCommands();
    const commands = list.map((c) => ({
      name: c.name,
      description: c.description,
    }));
    const content = commands
      .map((c) => `/${c.name} - ${c.description}`)
      .join('\n');
    return {
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: 'Voici la liste des commandes disponibles:\n' + content,
        flags: InteractionResponseFlags.EPHEMERAL,
      },
    };
  }

  private pingEvent(): InteractionResponse {
    const randomString = [
      'Attention ! Ce bot est développé par un Expert, ne faîtes pas ça chez vous.',
      "J'suis là...",
      "C'est à moi que tu parles ?",
      'ALLO ?',
      'Toujours vivant, toujours debout !',
      'Pong',
      'Tu vas la fermer ta gue*le ?',
      'QUOI ENCORE ???!!!',
      'Oui ?',
      "On m'appelle ?",
      'Je suis en ligne, pas sûr que ce soit encore le cas des autres bots...',
    ];
    return {
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: randomString[Math.floor(Math.random() * randomString.length)],
      },
    };
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
