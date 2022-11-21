import { Injectable, Logger } from '@nestjs/common';
import {
  InteractionResponseFlags,
  InteractionResponseType,
} from 'discord-interactions';
import { NeogeolocService } from 'src/neogeoloc/neogeoloc.service';
import {
  Command,
  CommandOptionType,
  GuildCommandEvent,
  InteractionResponse,
} from 'src/utils';
import { CommandService } from './commands.interface';

@Injectable()
export class NeogeolocCommand implements CommandService {
  private readonly logger = new Logger(NeogeolocCommand.name);

  constructor(private readonly neogeolocService: NeogeolocService) {}

  async execute({ data }): Promise<InteractionResponse> {
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
}

export const NEOGEOLOC_COMMAND: Command = {
  name: GuildCommandEvent.NEOGEOLOC,
  description: 'Enregistrer sa position en classe',
  options: [
    {
      type: CommandOptionType.STRING,
      name: 'token',
      description: 'Set your token',
      required: true,
    },
  ],
};
