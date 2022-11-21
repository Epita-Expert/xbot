import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  InteractionType,
  InteractionResponseType,
  InteractionResponseFlags,
  MessageComponentTypes,
} from 'discord-interactions';
import { DiscordService } from 'src/discord/discord.service';
import { NeogeolocService } from 'src/neogeoloc/neogeoloc.service';
import {
  capitalize,
  getRandomEmoji,
  getRPSChoices,
  GuildCommandEvent,
  InteractionResponse,
  RPSChoices,
} from '../utils';
import { AgendaCommand } from './commamds/agenda.commands';
import { ChallengeCommand } from './commamds/challenge.command';
import { EventCommand } from './commamds/event.commands';
import { NeogeolocCommand } from './commamds/neogeoloc.command';
import { PingCommand } from './commamds/ping.commands';
import { TestCommand } from './commamds/test.command';

// Store for in-progress games. In production, you'd want to use a DB
const activeGames = {};

@Injectable()
export class InteractionsService {
  private readonly logger = new Logger(InteractionsService.name);
  constructor(
    private readonly discordService: DiscordService,
    private readonly neogeolocService: NeogeolocService,
    private readonly eventEmitter: EventEmitter2,
    private readonly pingCommand: PingCommand,
    private readonly testCommand: TestCommand,
    private readonly eventCommand: EventCommand,
    private readonly agendaCommand: AgendaCommand,
    private readonly challengeCommand: ChallengeCommand,
    private readonly neogeolocCommand: NeogeolocCommand,
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

  /**
   * Handle verification requests
   */
  private async handleInteractionTypePing() {
    return {
      type: InteractionResponseType.PONG,
    };
  }
  /**
   * Handle slash command requests
   * See https://discord.com/developers/docs/interactions/application-commands#slash-commands
   */
  private async handleInteractionTypeApplicationCommand(
    body,
  ): Promise<InteractionResponse> {
    const { id, data, channel_id, member } = body;
    const { name } = data;

    this.logger.log(`Received ${name} command`);

    switch (name) {
      case GuildCommandEvent.TEST:
        return this.testCommand.execute();
      case GuildCommandEvent.PING:
        return this.pingCommand.execute();
      case GuildCommandEvent.EVENT:
        const event = await this.eventCommand.execute(data);
        await this.discordService.createEvent(event);
        return {
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: "L'événement a bien été ajouté",
            flags: InteractionResponseFlags.EPHEMERAL,
          },
        };
      case GuildCommandEvent.AGENDA:
        return await this.agendaCommand.execute({ data, channel_id });
      case GuildCommandEvent.CHALLENGE:
        return await this.challengeCommand.execute({ data, member, id });
      case GuildCommandEvent.NEOGEOLOC:
        return await this.neogeolocCommand.execute({ data });
      case GuildCommandEvent.STATUS:
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
      //   throw 'status string is too long (more than 64 characters)';`
      // }
      case GuildCommandEvent.HELP:
      default:
        return this.unknownEvent();
    }
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
}
