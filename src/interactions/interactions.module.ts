import { Module } from '@nestjs/common';
import { InteractionsService } from './interactions.service';
import { InteractionsController } from './interactions.controller';
import { DiscordModule } from 'src/discord/discord.module';
import { NeogeolocModule } from 'src/neogeoloc/neogeoloc.module';

@Module({
  imports: [DiscordModule, NeogeolocModule],
  providers: [InteractionsService],
  controllers: [InteractionsController],
})
export class InteractionsModule {}
