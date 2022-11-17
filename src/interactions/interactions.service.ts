import { Injectable } from '@nestjs/common';
import {
  InteractionType,
  InteractionResponseType,
  InteractionResponseFlags,
  MessageComponentTypes,
  ButtonStyleTypes,
} from 'discord-interactions';
import { DiscordService } from 'src/discord/discord.service';
import {
  capitalize,
  getRandomEmoji,
  getRPSChoices,
  RPSChoices,
} from '../utils';

// Store for in-progress games. In production, you'd want to use a DB
const activeGames = {};
@Injectable()
export class InteractionsService {
  constructor(private readonly discordService: DiscordService) {}

  public async getInteractions(body: any) {
    // Interaction type and data
    const { type, id, data } = body;

    /**
     * Handle verification requests
     */
    if (type === InteractionType.PING) {
      console.log('Received ping');
      return { type: InteractionResponseType.PONG };
    }

    /**
     * Handle slash command requests
     * See https://discord.com/developers/docs/interactions/application-commands#slash-commands
     */
    if (type === InteractionType.APPLICATION_COMMAND) {
      const { name } = data;

      // "test" guild command
      if (name === 'test') {
        // Send a message into the channel where command was triggered from
        return {
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            // Fetches a random emoji to send from a helper function
            content: 'hello world ' + getRandomEmoji(),
          },
        };
      }

      // "challenge" guild command
      if (name === 'challenge' && id) {
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
    }

    /**
     * Handle requests from interactive components
     * See https://discord.com/developers/docs/interactions/message-components#responding-to-a-component-interaction
     */
    if (type === InteractionType.MESSAGE_COMPONENT) {
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
