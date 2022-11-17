import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { CHALLENGE_COMMAND, TEST_COMMAND } from '../utils';

@Injectable()
export class DiscordService {
  private readonly appId: string;
  private readonly guildId: string;
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.appId = configService.get('discord').appId;
    this.guildId = configService.get('discord').guildId;
    this.hasGuildCommands([TEST_COMMAND, CHALLENGE_COMMAND]);
  }

  // API endpoint to get and post guild commands
  public async installGuildCommand(command: any) {
    const endpoint = `applications/${this.appId}/guilds/${this.guildId}/commands`;
    console.log(`Installing "${command['name']}"`);
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

  private async hasGuildCommands(commands) {
    for await (const command of commands) {
      await this.hasGuildCommand(command);
    }
  }

  // Checks for a command
  private async hasGuildCommand(command) {
    try {
      const data = await this.getGuildCommands();

      if (data) {
        const installedNames = data.map((c) => c['name']);
        // This is just matching on the name, so it's not good for updates
        if (!installedNames.includes(command['name'])) {
          console.log(`Installing "${command['name']}"`);
          await this.installGuildCommand(command);
        } else {
          console.log(`"${command['name']}" command already installed`);
        }
      }
    } catch (err) {
      console.log(err.response);
      console.log(err.message);
      throw err;
    }
  }
}
