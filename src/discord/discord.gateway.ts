import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { WebSocket } from 'ws';

// @WebSocketGateway()
@Injectable()
export class DiscordGateway {
  private readonly logger = new Logger(DiscordGateway.name);
  private ws: WebSocket;

  // @WebSocketServer()
  // server: Server;

  constructor(private eventEmitter: EventEmitter2) {
    this.connect();
  }

  connect() {
    // this.ws = new WebSocket('wss://gateway.discord.gg/?v=9&encoding=json');
    // this.ws.onopen = (e) => {
    //   this.logger.log('Connected to Discord Gateway');
    // };
    // this.ws.onmessage = (e) => {
    //   this.logger.log('Message from Discord Gateway');
    //   console.log(e.data);
    // };
    // this.ws.emit('hello', 'world');
    // this.ws.onopen(() => {
    //   this.isConnected = true;
    //   this.logger.log('Connected to Discord Gateway');
  }

  // @SubscribeMessage('message')
  // handleMessage(client: any, payload: any): string {
  //   return 'Hello world!';
  // }
}
