import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class MissKeyInstance extends Document {
  @Prop()
  website: string;

  @Prop()
  client_id: string;

  @Prop()
  client_secret: string;

  @Prop()
  auth_url: string;  
}

export const MissKeyInstanceSchema = SchemaFactory.createForClass(
  MissKeyInstance,
);
