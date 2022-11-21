import { Logger } from '@nestjs/common';
import {
  InteractionResponseType,
  InteractionResponseFlags,
} from 'discord-interactions';
import { DiscordService } from 'src/discord/discord.service';
import {
  InteractionResponse,
  Event,
  EventEntityType,
  EventPrivacyLevel,
} from 'src/utils';
import { CommandService } from './commands.interface';

export class EventCommand implements CommandService {
  private readonly logger = new Logger(EventCommand.name);

  constructor(private readonly discordService: DiscordService) {}

  async execute(data): Promise<InteractionResponse> {
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
}
