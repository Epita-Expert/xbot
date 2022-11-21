import { Logger } from '@nestjs/common';
import {
  InteractionResponseType,
  MessageComponentTypes,
  ButtonStyleTypes,
} from 'discord-interactions';
import { DiscordService } from 'src/discord/discord.service';
import {
  Command,
  createCommandChoices,
  GuildCommandEvent,
  InteractionResponse,
} from 'src/utils';
import { CommandService } from './commands.interface';

// Store for in-progress games. In production, you'd want to use a DB
const activeGames = {};

export class ChallengeCommand implements CommandService {
  private readonly logger = new Logger(ChallengeCommand.name);

  constructor(private readonly discordService: DiscordService) {}

  async execute({ data, member, id }): Promise<InteractionResponse> {
    const { options } = data;
    const userId = member.user.id;
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
                custom_id: `accept_button_${id}`,
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

export const CHALLENGE_COMMAND: Command = {
  name: GuildCommandEvent.CHALLENGE,
  description: 'Challenge to a match of rock paper scissors',
  options: [
    {
      type: 3,
      name: 'object',
      description: 'Pick your object',
      required: true,
      choices: createCommandChoices(),
    },
  ],
  type: 1,
};
