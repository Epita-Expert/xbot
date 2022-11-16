import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { verifyKey } from 'discord-interactions';
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

  public async VerifyDiscordRequest(clientKey: string) {
    return function (req, res, buf, encoding) {
      const signature = req.get('X-Signature-Ed25519');
      const timestamp = req.get('X-Signature-Timestamp');

      const isValidRequest = verifyKey(buf, signature, timestamp, clientKey);
      if (!isValidRequest) {
        res.status(401).send('Bad request signature');
        throw new Error('Bad request signature');
      }
    };
  }

  public async installGuildCommand(command: any) {
    // API endpoint to get and post guild commands
    const endpoint = `applications/${this.appId}/guilds/${this.guildId}/commands`;
    console.log(`Installing "${command['name']}"`);
    // install command
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

  public async getGuildCommands() {
    // API endpoint to get and post guild commands
    const endpoint = `applications/${this.appId}/guilds/${this.guildId}/commands`;
    // install command
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

  private async hasGuildCommands(commands) {
    commands.forEach((c) => this.hasGuildCommand(c));
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
      throw err;
    }
  }
}
