import { Module } from '@nestjs/common';
import { MissKeyService } from './misskey.service';
import { MissKeyController } from './misskey.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { MissKeyInstanceSchema } from './misskey.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'MissKey',
        schema: MissKeyInstanceSchema,
      },
    ]),
  ],
  providers: [MissKeyService],
  controllers: [MissKeyController],
})
export class MissKeyModule {}
