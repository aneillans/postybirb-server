import { Module } from '@nestjs/common';
import { DeviantArtModule } from './deviant-art/deviant-art.module';
import { MastodonModule } from './mastodon/mastodon.module';
import { MissKeyModule } from './misskey/misskey.module';
import { TumblrModule } from './tumblr/tumblr.module';
import { TwitterModule } from './twitter/twitter.module';

@Module({
  imports: [
    TumblrModule,
    DeviantArtModule,
    MastodonModule,
    MissKeyModule,
    TwitterModule],
})
export class V2AppModule {}
