import {
  InteractionResponseFlags,
  InteractionResponseType,
} from 'discord-interactions';

// Simple method that returns a random emoji from list
export function getRandomEmoji() {
  const emojiList = [
    '😭',
    '😄',
    '😌',
    '🤓',
    '😎',
    '😤',
    '🤖',
    '😶‍🌫️',
    '🌏',
    '📸',
    '💿',
    '👋',
    '🌊',
    '✨',
  ];
  return emojiList[Math.floor(Math.random() * emojiList.length)];
}

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Get the game choices from game.js
export function createCommandChoices() {
  const choices = getRPSChoices();
  const commandChoices = [];

  for (const choice of choices) {
    commandChoices.push({
      name: capitalize(choice),
      value: choice.toLowerCase(),
    });
  }

  return commandChoices;
}

export function getRPSChoices() {
  return Object.keys(RPSChoices);
}

// this is just to figure out winner + verb
export const RPSChoices = {
  rock: {
    description: 'sedimentary, igneous, or perhaps even metamorphic',
    virus: 'outwaits',
    computer: 'smashes',
    scissors: 'crushes',
  },
  cowboy: {
    description: 'yeehaw~',
    scissors: 'puts away',
    wumpus: 'lassos',
    rock: 'steel-toe kicks',
  },
  scissors: {
    description: 'careful ! sharp ! edges !!',
    paper: 'cuts',
    computer: 'cuts cord of',
    virus: 'cuts DNA of',
  },
  virus: {
    description: 'genetic mutation, malware, or something inbetween',
    cowboy: 'infects',
    computer: 'corrupts',
    wumpus: 'infects',
  },
  computer: {
    description: 'beep boop beep bzzrrhggggg',
    cowboy: 'overwhelms',
    paper: 'uninstalls firmware for',
    wumpus: 'deletes assets for',
  },
  wumpus: {
    description: 'the purple Discord fella',
    paper: 'draws picture on',
    rock: 'paints cute face on',
    scissors: 'admires own reflection in',
  },
  paper: {
    description: 'versatile and iconic',
    virus: 'ignores',
    cowboy: 'gives papercut to',
    rock: 'covers',
  },
};

export type Channel = {
  id: string;
  name: string;
  type: number;
  nsfw: boolean;
  last_message_id: string | null;
};
export enum EmbedType {
  'rich' = 1,
  'image' = 2,
  'video' = 3,
  'gifv' = 4,
  'article' = 5,
  'link' = 6,
}

export type EmbedAuthor = {
  name: string;
  url?: string;
  icon_url?: string;
  proxy_icon_url?: string;
};

export type EmbedField = {
  name: string;
  value: string;
  inline?: boolean;
};

export type EmbedFooter = {
  text: string;
  icon_url?: string;
  proxy_icon_url?: string;
};

export type Embed = {
  title?: string;
  type?: EmbedType;
  description?: string;
  url?: string;
  timestamp?: string;
  color?: number;
  footer?: EmbedFooter;
  // image?: EmbedImage;
  // thumbnail?: EmbedThumbnail;
  // video?: EmbedVideo;
  // provider?: EmbedProvider;
  author?: EmbedAuthor;
  fields?: EmbedField[];
};

export enum EventEntityType {
  STAGE_INSTANCE = 1,
  VOICE = 2,
  ETERNAL = 3,
}

export enum EventPrivacyLevel {
  // PUBLIC = 1,
  GUILD_ONLY = 2,
  // GUILD_AND_FRIENDS = 3,
  // GUILD_AND_PUBLIC = 4,
}

export type EventEntityMetadata = {
  location?: string;
};
export type Event = {
  channel_id?: string;
  entity_metadata?: EventEntityMetadata;
  name: string;
  privacy_level: EventPrivacyLevel;
  scheduled_start_time?: string;
  scheduled_end_time?: string;
  description?: string;
  entity_type: EventEntityType;
  // image?: string;
};

export type InteractionApplicationCommandCallbackData = {
  tts?: boolean;
  content?: string;
  embeds?: Embed[];
  allowed_mentions?: any;
  flags?: InteractionResponseFlags;
  components?: any[];
  attachments?: any[];
};

export type CreateMessageData = {
  content?: string;
  nonce?: string | number;
  tts?: boolean;
  embeds?: Embed[];
  allowed_mentions?: any;
  message_reference?: MessageReference;
  components?: any[];
  sticker_ids?: string[];
  files?: any[];
  payload_json?: string;
  attachments?: any[];
  flags?: InteractionResponseFlags;
};

export type MessageReference = {
  message_id?: string;
  channel_id?: string;
  guild_id?: string;
  fail_if_not_exists?: boolean;
};

export type InteractionResponse = {
  type: InteractionResponseType;
  data?: InteractionApplicationCommandCallbackData;
};

export enum CommandType {
  CHAT_INPUT = 1, //	Slash commands; a text-based command that shows up when a user types /
  USER = 2, // A UI-based command that shows up when you right click or tap on a user
  MESSAGE = 3, //	A UI-based command that shows up when you right click or tap on a message
}

export enum CommandOptionType {
  SUB_COMMAND = 1, //
  SUB_COMMAND_GROUP = 2, //
  STRING = 3, //
  INTEGER = 4, //	Any integer between -2^53 and 2^53
  BOOLEAN = 5, //
  USER = 6, //
  CHANNEL = 7, //	Includes all channel types + categories
  ROLE = 8, //
  MENTIONABLE = 9, //	Includes users and roles
  NUMBER = 10, //	Any double between -2^53 and 2^53
  ATTACHMENT = 11, //	attachment object
}
export enum GuildCommandEvent {
  TEST = 'test',
  CHALLENGE = 'challenge',
  STATUS = 'status',
  AGENDA = 'agenda',
  EVENT = 'event',
  NEOGEOLOC = 'neogeoloc',
  HELP = 'help',
  PING = 'ping',
}

export type Command = {
  name: GuildCommandEvent;
  description: string;
  type?: CommandType;
  options?: CommandOption[];
  default_permission?: boolean;
  _requiresUpdate?: boolean;
};

export type CommandOption = {
  name: string;
  description: string;
  type: CommandOptionType;
  options?: CommandOption[];
  choices?: CommandChoice[];
  required?: boolean;
};

export type CommandChoice = {
  name: string;
  value: string | number;
  name_localizations?: any;
};

export const HELP_COMMAND: Command = {
  name: GuildCommandEvent.HELP,
  description: 'Help command',
  type: 1,
};

export const STATUS_COMMAND: Command = {
  name: GuildCommandEvent.STATUS,
  description: 'Change le statut du bot xBot',
  options: [
    {
      name: 'type',
      description: 'Le type de statut',
      type: CommandOptionType.STRING,
      required: true,
      choices: [
        {
          name: 'Regarde (WATCHING)',
          value: 'WATCHING',
        },
        {
          name: 'Participant à : (COMPETING)',
          value: 'COMPETING',
        },
        {
          name: 'Joue à (PLAYING)',
          value: 'PLAYING',
        },
        {
          name: 'Écoute (LISTENING)',
          value: 'LISTENING',
        },
        {
          name: 'Joue à (STREAMING)',
          value: 'STREAMING',
        },
      ],
    },
    {
      name: 'message',
      description: 'Le message de statut du bot',
      type: CommandOptionType.STRING,
      required: true,
    },
  ],
  default_permission: false,
};
