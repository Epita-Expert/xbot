import { Body, Controller, Get } from '@nestjs/common';
import { InteractionsService } from './interactions.service';

@Controller('interactions')
export class InteractionsController {
  constructor(private readonly interactionsService: InteractionsService) {}

  @Get()
  getInteractions(@Body() body) {
    return this.interactionsService.getInteractions(body);
  }
}
