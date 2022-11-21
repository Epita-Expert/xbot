import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import {
  Channel,
  CreateMessageData,
  Event,
  HELP_COMMAND,
  Command,
  STATUS_COMMAND,
} from '../utils';
import { NEOGEOLOC_COMMAND } from 'src/interactions/commamds/neogeoloc.command';
import { AGENDA_COMMAND } from 'src/interactions/commamds/agenda.commands';
import { CHALLENGE_COMMAND } from 'src/interactions/commamds/challenge.command';
import { EVENT_COMMAND } from 'src/interactions/commamds/event.commands';
import { PING_COMMAND } from 'src/interactions/commamds/ping.commands';
import { TEST_COMMAND } from 'src/interactions/commamds/test.command';
@Injectable()
export class DiscordService {
  private logger = new Logger(DiscordService.name);
  private readonly appId: string;
  private readonly guildId: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    // this.client.login(configService.get('discord').token);
    this.appId = configService.get('discord').appId;
    this.guildId = configService.get('discord').guildId;
    // for (const options of AGENDA_COMMAND.options) {
    //   for (const options1 of options.options) {
    //     if (options1.choices && options1.choices.length > 0) {
    //       for (const choices of options1.choices) {
    //         console.log(choices);
    //       }
    //     }
    //   }
    // }
    this.hasGuildCommands([
      TEST_COMMAND,
      CHALLENGE_COMMAND,
      STATUS_COMMAND,
      AGENDA_COMMAND,
      EVENT_COMMAND,
      NEOGEOLOC_COMMAND,
      PING_COMMAND,
      HELP_COMMAND,
    ]);
  }

  // API endpoint to post or update guild commands
  public async installGuildCommand(command: any) {
    const endpoint = `applications/${this.appId}/guilds/${this.guildId}/commands`;
    return new Promise<any[]>((resolve, reject) => {
      this.httpService.post(endpoint, command).subscribe({
        next: (response) => {
          resolve(response.data);
        },
        error: (error) => {
          reject(error);
        },
      });
    });
  }

  public async getGateway() {
    const endpoint = `wss://gateway.discord.gg/`;
    this.logger.log(`Getting gateway`);
    return new Promise<any[]>((resolve, reject) => {
      this.httpService.get(endpoint).subscribe({
        next: (response) => {
          this.logger.log(response.data);
          resolve(response.data);
        },
        error: (error) => {
          reject(error);
        },
      });
    });
  }
  // API endpoint to get and post guild commands
  public async getGuildCommands() {
    const endpoint = `applications/${this.appId}/guilds/${this.guildId}/commands`;
    return new Promise<any[]>((resolve, reject) => {
      this.httpService.get(endpoint).subscribe({
        next: (response) => {
          resolve(response.data);
        },
        error: (error) => {
          reject(error);
        },
      });
    });
  }

  public async deleteGuildCommand(command) {
    const endpoint = `applications/${this.appId}/guilds/${this.guildId}/commands/${command.id}`;
    this.logger.log(`Deleting command ${command.name}`);
    return new Promise<any[]>((resolve, reject) => {
      this.httpService.delete(endpoint).subscribe({
        next: (response) => {
          resolve(response.data);
        },
        error: (error) => {
          reject(error);
        },
      });
    });
  }

  // Delete message with token in request body
  public async deleteMessage(body) {
    const endpoint = `webhooks/${this.appId}/${body.token}/messages/${body.message.id}`;
    return new Promise<any[]>((resolve, reject) => {
      this.httpService.delete(endpoint).subscribe({
        next: (response) => {
          resolve(response.data);
        },
        error: (error) => {
          reject(error);
        },
      });
    });
  }

  // Update message with token in request body
  // Update ephemeral message
  public async updateMessage(body) {
    const endpoint = `webhooks/${process.env.APP_ID}/${body.token}/messages/${body.message.id}`;
    return new Promise<any[]>((resolve, reject) => {
      this.httpService.patch(endpoint, body).subscribe({
        next: (response) => {
          resolve(response.data);
        },
        error: (error) => {
          reject(error);
        },
      });
    });
  }

  private async hasGuildCommands(commands: Command[]) {
    try {
      const data = await this.getGuildCommands();

      const installedNames = data.map((c) => c['name']);
      const commandsNames = commands.map((c) => c['name']);
      const toInstall = commands.filter(
        (c) => !installedNames.includes(c['name']),
      );
      const toDelete = data.filter((c) => !commandsNames.includes(c['name']));
      const toUpdate = commands.filter((c) =>
        c._requiresUpdate ? c['name'] : null,
      );

      this.logger.log(
        `These commands will be installed: ${toInstall.map((c) => c['name'])}`,
      );
      this.logger.log(
        `These commands will be uninstalled: ${toDelete.map((c) => c['name'])}`,
      );
      this.logger.log(
        `These commands will be updated: ${toUpdate.map((c) => c['name'])}`,
      );
      const toUpsert = [...toInstall, ...toUpdate];
      for await (const command of toUpsert) {
        await this.installGuildCommand(command);
      }
      for await (const command of toDelete) {
        await this.deleteGuildCommand(command);
      }
    } catch (error) {
      this.handleErrors(error);
    }
  }

  // // Checks for a command
  // private async hasGuildCommand(command: Command, data) {
  //   try {
  //     if (data) {
  //       const installedNames = data.map((c) => c['name']);
  //       // This is just matching on the name, so it's not good for updates
  //       if (!installedNames.includes(command['name'])) {
  //         await this.installGuildCommand(command);
  //         this.logger.log(`"${command['name']}" installed`);
  //       } else if (false) {
  //         this.logger.log(`"${command['name']}" command already installed`);
  //       } else {
  //         this.logger.log(`"${command['name']}" command already installed`);
  //       }
  //     }
  //   } catch (err) {
  //     this.handleErrors(err);
  //   }
  // }

  public async getChannel(channelId: string) {
    // return this.client.channels.fetch(channelId);
    const endpoint = `channels/${channelId}`;
    this.logger.log(`Fetching channel ${channelId}`);
    return new Promise<any[]>((resolve, reject) => {
      this.httpService.get(endpoint).subscribe({
        next: (response) => {
          this.logger.log(response.data);
          resolve(response.data);
        },
        error: (error) => {
          reject(error);
        },
      });
    });
  }

  public async getChannels() {
    // return this.client.channels.fetch(channelId);
    const endpoint = `guilds/${this.guildId}/channels`;
    this.logger.log(`Fetching channels of Guild ${this.guildId}`);
    return new Promise<Channel[]>((resolve, reject) => {
      this.httpService.get(endpoint).subscribe({
        next: (response) => {
          // this.logger.debug(response.data);
          resolve(response.data);
        },
        error: (error) => {
          reject(error);
        },
      });
    });
  }

  public async createMessage(channelId: string, data: CreateMessageData) {
    const endpoint = `channels/${channelId}/messages`;
    this.logger.log(`Creating message in channel ${channelId}`);
    return new Promise<any>((resolve, reject) => {
      this.httpService.post(endpoint, data).subscribe({
        next: (response) => {
          this.logger.log(response.data);
          resolve(response.data);
        },
        error: (error) => {
          reject(error);
        },
      });
    });
  }

  public async createReaction(
    channelId: string,
    messageId: string,
    emoji: string,
  ) {
    const endpoint = `channels/${channelId}/messages/${messageId}/reactions/${emoji}/@me`;
    this.logger.log(`Creating reaction in channel ${channelId}`);
    return new Promise<any[]>((resolve, reject) => {
      this.httpService.put(endpoint).subscribe({
        next: (response) => {
          this.logger.log(response.data);
          resolve(response.data);
        },
        error: (error) => {
          reject(error);
        },
      });
    });
  }

  public async createEvent(event: Event) {
    const endpoint = `/guilds/${this.guildId}/scheduled-events`;
    this.logger.log(`Creating event`);
    return new Promise<any[]>((resolve, reject) => {
      this.httpService.post(endpoint, event).subscribe({
        next: (response) => {
          this.logger.log(response.data);
          resolve(response.data);
        },
        error: (error) => {
          this.handleErrors(error);
          reject(error);
        },
      });
    });
  }

  private handleErrors(err) {
    console.log(err.message);
    const data = err.response.data;
    console.log('Error response data:', data);

    if (data && data.errors) {
      for (const [key] of Object.entries(data.errors)) {
        const error = data.errors[key];
        if (error._errors) {
          console.log('Data errors', error);
        }
        if (data.errors.options) {
          const options = data.errors.options;

          for (const key1 of Object.keys(options)) {
            const option1 = options[key1];

            for (const key2 of Object.keys(option1)) {
              const option2 = option1[key2];
              for (const key3 of Object.keys(option2)) {
                const option3 = option2[key3];
                for (const key4 of Object.keys(option3)) {
                  const option4 = option3[key4];

                  for (const key5 of Object.keys(option4)) {
                    const option5 = option4[key5];

                    for (const key6 of Object.keys(option5)) {
                      const option6 = option5[key6];
                      console.log(option6);
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    throw err;
  }
}
