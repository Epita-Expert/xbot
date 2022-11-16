import { registerAs } from '@nestjs/config';

export default registerAs('discord', () => {
  return {
    guildId: process.env.DISCORD_GUILD_ID as string,
    appId: process.env.DISCORD_APP_ID as string,
    token: process.env.DISCORD_TOKEN as string,
  };
});
