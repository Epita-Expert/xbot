import { Injectable } from '@nestjs/common';
@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getPrivacyPolicy(): string {
    return 'Privacy Policy';
  }

  getTermsOfService(): string {
    return 'Terms of Service';
  }
}
