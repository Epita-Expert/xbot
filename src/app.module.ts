import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DiscordModule } from './discord/discord.module';
import { InteractionsModule } from './interactions/interactions.module';

@Module({
  imports: [DiscordModule, InteractionsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
