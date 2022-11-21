import { NestFactory } from '@nestjs/core';
import { verifyKey } from 'discord-interactions';
import * as express from 'express';
import { AppModule } from './app.module';

function VerifyDiscordRequest(clientKey) {
  return function (req, res, buf, encoding) {
    const signature = req.get('X-Signature-Ed25519');
    const timestamp = req.get('X-Signature-Timestamp');

    const isValidRequest = verifyKey(buf, signature, timestamp, clientKey);
    if (!isValidRequest) {
      console.error('Invalid request signature', signature, timestamp, buf);
      // throw new Error('Bad request signature');
      res.status(401).send('Bad request signature');
    }
  };
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    express.json({
      verify: VerifyDiscordRequest(process.env.DISCORD_PUBLIC_KEY),
    }),
  );
  // app.use(verifyKeyMiddleware(process.env.DISCORD_PUBLIC_KEY));
  await app.listen(3000);
}
bootstrap();
