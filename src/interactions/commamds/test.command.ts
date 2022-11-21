import { Injectable, Logger } from '@nestjs/common';
import { InteractionResponseType } from 'discord-interactions';
import { InteractionResponse, getRandomEmoji } from 'src/utils';
import { CommandService } from './commands.interface';

@Injectable()
export class TestCommand implements CommandService {
  private readonly logger = new Logger(TestCommand.name);

  async execute(): Promise<InteractionResponse> {
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
}
