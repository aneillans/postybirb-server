import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { V1AppModule } from './v1/app.module';
import { V2AppModule } from './v2/app.module';

// TODO: Look at re-implementing the reconnect; does not appear to be on later Mongoose versions for connect
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.DB_CONNECTION_STRING), 
    V1AppModule,
    V2AppModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
