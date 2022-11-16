import { Module } from '@nestjs/common';
import { InteractionsService } from './interactions.service';
import { InteractionsController } from './interactions.controller';
import { DiscordModule } from 'src/discord/discord.module';

@Module({
  imports: [DiscordModule],
  providers: [InteractionsService],
  controllers: [InteractionsController],
})
export class InteractionsModule {}
