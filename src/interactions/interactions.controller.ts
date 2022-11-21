import { Body, Controller, Get, Logger, Post } from '@nestjs/common';
import { InteractionsService } from './interactions.service';

@Controller('interactions')
export class InteractionsController {
  private readonly logger = new Logger(InteractionsController.name);
  constructor(private readonly interactionsService: InteractionsService) {}

  @Post()
  getInteractions(@Body() body) {
    this.logger.log('Received interaction');
    return this.interactionsService.getInteractions(body);
  }

  @Get('commands')
  getCommands() {
    return this.interactionsService.getCommands();
  }
}
