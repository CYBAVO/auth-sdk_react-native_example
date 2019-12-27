import {
  createAuthenticator,
  Authenticator,
} from '@cybavo/react-native-auth-service';
import AsyncStorage from '@react-native-community/async-storage';
import { SERVICE_ENDPOINT, SERVICE_API_CODE } from './BuildConfig.json';

export const Service = {
  async getConfig() {
    const [[, endpoint], [, apiCode]] = await AsyncStorage.multiGet([
      '@service_endpoint',
      '@service_api_code',
    ]);

    return {
      endpoint: endpoint || SERVICE_ENDPOINT,
      apiCode: apiCode || SERVICE_API_CODE,
    };
  },

  async setConfig({ endpoint, apiCode }) {
    await AsyncStorage.multiSet([
      ['@service_endpoint', endpoint],
      ['@service_api_code', apiCode],
    ]);
    console.log('cfg:', await this.getConfig());
  },

  get(): Promise<Authenticator> {
    if (!this.promise) {
      this.promise = new Promise(resolve =>
        resolve(
          this.getConfig().then(({ endpoint, apiCode }) =>
            createAuthenticator(endpoint, apiCode)
          )
        )
      );
    }
    return this.promise;
  },
};
