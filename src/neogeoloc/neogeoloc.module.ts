import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { NeogeolocService } from './neogeoloc.service';

@Module({
  imports: [
    HttpModule.register({
      baseURL: 'https://epita.neogeoloc.com',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  ],
  providers: [NeogeolocService],
  exports: [NeogeolocService],
})
export class NeogeolocModule {}
