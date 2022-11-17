import { Body, Controller, Post } from '@nestjs/common';
import { InteractionsService } from './interactions.service';

@Controller('interactions')
export class InteractionsController {
  constructor(private readonly interactionsService: InteractionsService) {}

  @Post()
  getInteractions(@Body() body) {
    console.log('Received interaction', body);
    return this.interactionsService.getInteractions(body);
  }
}
