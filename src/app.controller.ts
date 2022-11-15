import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('privacy-policy')
  getPrivacyPolicy(): string {
    return this.appService.getPrivacyPolicy();
  }

  @Get('terms-of-service')
  getTermsOfService(): string {
    return this.appService.getTermsOfService();
  }
}
