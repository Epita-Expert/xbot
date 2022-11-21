import { Module } from '@nestjs/common';
import { DiscordService } from './discord.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DiscordGateway } from './discord.gateway';
import discordConfig from './discord.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [discordConfig],
    }),
    HttpModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        // timeout: 5000,
        // maxRedirects: 5,
        baseURL: 'https://discord.com/api/v10/',
        headers: {
          Authorization: `Bot ${configService.get('discord').token}`,
          'Content-Type': 'application/json; charset=UTF-8',
          'User-Agent':
            'DiscordBot (https://github.com/discord/discord-example-app, 1.0.0)',
        },
      }),
    }),
  ],
  providers: [DiscordService, DiscordGateway],
  exports: [DiscordService],
})
export class DiscordModule {}
