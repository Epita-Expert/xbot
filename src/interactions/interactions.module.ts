import { Module } from '@nestjs/common';
import { InteractionsService } from './interactions.service';
import { InteractionsController } from './interactions.controller';
import { DiscordModule } from 'src/discord/discord.module';
import { NeogeolocModule } from 'src/neogeoloc/neogeoloc.module';
import { PingCommand } from './commamds/ping.commands';
import { TestCommand } from './commamds/test.command';
import { EventCommand } from './commamds/event.commands';
import { AgendaCommand } from './commamds/agenda.commands';
import { ChallengeCommand } from './commamds/challenge.command';
import { NeogeolocCommand } from './commamds/neogeoloc.command';

@Module({
  imports: [DiscordModule, NeogeolocModule],
  providers: [
    InteractionsService,
    PingCommand,
    TestCommand,
    EventCommand,
    AgendaCommand,
    ChallengeCommand,
    NeogeolocCommand,
  ],
  controllers: [InteractionsController],
})
export class InteractionsModule {}
