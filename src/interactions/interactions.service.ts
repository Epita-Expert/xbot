import { Injectable } from '@nestjs/common';
import {
  InteractionType,
  InteractionResponseType,
  InteractionResponseFlags,
  MessageComponentTypes,
  ButtonStyleTypes,
} from 'discord-interactions';
import {
  capitalize,
  getRandomEmoji,
  getRPSChoices,
  RPSChoices,
} from '../utils';

@Injectable()
export class InteractionsService {
  getInteractions(body: any) {
    // Interaction type and data
    const { type, id, data } = body;

    /**
     * Handle verification requests
     */
    if (type === InteractionType.PING) {
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
