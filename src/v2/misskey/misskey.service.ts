import {
  Injectable,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import generator, { OAuth } from 'megalodon'
import { Model } from 'mongoose';
import { ApiResponse } from 'src/v2/common/models/api-response.model';
import { MissKeyInstance } from './misskey.schema';
import { MissKeyAuthorization } from './models/misskey-authorization.model';

@Injectable()
export class MissKeyService {
  private readonly logger = new Logger(MissKeyService.name);

  constructor(
    @InjectModel('MissKey')
    private readonly repository: Model<MissKeyInstance>,
  ) {}

  async startAuthorization(website: string): Promise<MissKeyInstance> {
    let model = await this.findMissKeyInstance(website);
    if (!model) {
      try {
        const client = generator('misskey', website);
  
        model = new this.repository({
          website
        });

        await client.registerApp('PostyBirb', {} )
          .then(appData => {
            model.client_id = appData.clientId
            model.client_secret = appData.clientSecret
            model.auth_url = appData.url
          });

        model.save();

      } catch (err) {
        this.logger.error(err, '', `MissKey Auth URL Failure ${website}`);
        throw new InternalServerErrorException(
          `Unable to authorize ${website} at this time`,
        );
      }      
    }

    return model;
  }

  async completeAuthorization(
    data: MissKeyAuthorization,
  ): Promise<ApiResponse<{ token: string; username: string }>> {
    const model = await this.findMissKeyInstance(data.website);
    if (!model) {
      return new ApiResponse({
        error: `Unable to authenticate to an unregistered MissKey instance ${data.website}`,
      });
    }

    try {
      const client = generator('misskey', data.website);

      let accessToken;
      let refreshToken;

      client.fetchAccessToken(model.client_id, model.client_secret, data.code)
        .then((tokenData: OAuth.TokenData) => {
          accessToken = tokenData.accessToken;
          refreshToken = tokenData.refreshToken;
        })
        .catch((err: Error) => {
          return new ApiResponse({ error: err.message });
        });

      // May need to recreate the client ..

      client.verifyAccountCredentials()
        .then(res => {
          return new ApiResponse({ data: { accessToken, username: res.data.username } });
        })
        .catch((err: Error) => {
          return new ApiResponse({ error: err.message });
        });
    } catch (err) {
      const errString = `Unable to complete ${data.website} authentication`;
      this.logger.error(err, '', errString);
      return new ApiResponse({ error: errString });
    }
    return new ApiResponse({ error: "Incomplete" });
  }

  private async findMissKeyInstance(
    website: string,
  ): Promise<MissKeyInstance> {
    return this.repository.findOne({ website }).exec();
  }
}
