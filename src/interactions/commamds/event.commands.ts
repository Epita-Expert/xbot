import { Logger } from '@nestjs/common';
import {
  Event,
  EventEntityType,
  EventPrivacyLevel,
  CommandOptionType,
  Command,
  GuildCommandEvent,
} from 'src/utils';
import { CommandService } from './commands.interface';

export class EventCommand implements CommandService {
  private readonly logger = new Logger(EventCommand.name);

  async execute(data): Promise<Event> {
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
    return event;
  }
}

// function that list all hours and minutes 30 minutes interval with map()

const listAllHours = () =>
  new Array(24)
    .fill(0)
    .map((_, i) => {
      const hours = new Array(2)
        .fill(30)
        .map(
          (x, j) =>
            `${i.toString().padStart(2, '0')}:${(j * x)
              .toString()
              .padStart(2, '0')}`,
        );
      return hours;
    })
    .reduce((acc, val) => acc.concat(val), [])
    .slice(18, -7);

export const EVENT_COMMAND: Command = {
  name: GuildCommandEvent.EVENT,
  description:
    "Gestion des événements , il est possible de s'abonner aux rappels des événements",
  options: [
    {
      name: 'add',
      description: 'Ajoute un événement',
      type: CommandOptionType.SUB_COMMAND,
      options: [
        {
          name: 'emplacement',
          description: "Emplacement de l'événement",
          type: CommandOptionType.STRING,
          required: true,
        },
        {
          name: 'nom',
          description: "Nom de l'événement",
          type: CommandOptionType.STRING,
          required: true,
        },
        {
          name: 'description',
          description: "Description de l'événement",
          type: CommandOptionType.STRING,
          required: true,
        },
        {
          name: 'jour',
          description: "Jour de l'événement (format JJ)",
          type: CommandOptionType.INTEGER,
          required: true,
        },
        {
          name: 'mois',
          description: "Mois de l'événement",
          type: CommandOptionType.INTEGER,
          required: true,
          choices: [
            {
              name: 'Janvier',
              value: 1,
            },
            {
              name: 'Février',
              value: 2,
            },
            {
              name: 'Mars',
              value: 3,
            },
            {
              name: 'Avril',
              value: 4,
            },
            {
              name: 'Mai',
              value: 5,
            },
            {
              name: 'Juin',
              value: 6,
            },
            {
              name: 'Juillet',
              value: 7,
            },
            {
              name: 'Août',
              value: 8,
            },
            {
              name: 'Septembre',
              value: 9,
            },
            {
              name: 'Octobre',
              value: 10,
            },
            {
              name: 'Novembre',
              value: 11,
            },
            {
              name: 'Décembre',
              value: 12,
            },
          ],
        },
        {
          name: 'annee',
          description: "Année de l'événement",
          type: CommandOptionType.INTEGER,
          required: true,
          choices: new Array(3).fill(undefined).map((_, i) => ({
            name: (new Date().getFullYear() + i).toString(),
            value: new Date().getFullYear() + i,
          })),
        },
        {
          name: 'heure_debut',
          description: "Heure de debut de l'événement",
          type: CommandOptionType.STRING,
          required: true,
          choices: listAllHours().map((i) => ({
            name: i.toString(), //("0" + i).slice(-2)
            value: i.toString(), //i
          })),
        },
        {
          name: 'heure_fin',
          description: "Heure de fin de l'événement",
          type: CommandOptionType.STRING,
          required: true,
          choices: listAllHours().map((i) => ({
            name: i.toString(), //("0" + i).slice(-2)
            value: i.toString(), //i
          })),
        },
      ],
    },
  ],
};
