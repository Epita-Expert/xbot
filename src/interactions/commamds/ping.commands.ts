import { Injectable, Logger } from '@nestjs/common';
import { InteractionResponseType } from 'discord-interactions';
import { InteractionResponse } from 'src/utils';
import { CommandService } from './commands.interface';

@Injectable()
export class PingCommand implements CommandService {
  private readonly logger = new Logger(PingCommand.name);

  async execute(): Promise<InteractionResponse> {
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
    // randomString = [
    //   "Ferme la",
    //   "Rho TG",
    //   "Super.",
    //   "Qui s'en fout ?",
    //   "Ferme ta gue*le",
    //   "Euuh... Silence ?",
    //   "Tu vas la fermer ta gue*le ?",
    //   "Cool ta vie.",
    //   "ok.",
    //   "Rien à foutre",
    // ];
    return {
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: randomString[Math.floor(Math.random() * randomString.length)],
        flags: 64,
      },
    };
  }
}
