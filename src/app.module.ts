import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DiscordModule } from './discord/discord.module';
import { InteractionsModule } from './interactions/interactions.module';
import { NeogeolocModule } from './neogeoloc/neogeoloc.module';

@Module({
  imports: [
    DiscordModule,
    InteractionsModule,
    EventEmitterModule.forRoot(),
    NeogeolocModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
