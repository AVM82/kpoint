import { HttpMethod } from 'common/enums/http/http-method.enum';

import { ContentType } from '../../common/enums/file/content-type.enum';
import { ResponseType } from '../../common/types/response/response';
import { SignInType } from '../../common/types/sign-in/sign-in';
import { SignUpType } from '../../common/types/sign-up/sign-up';
import { Http } from '../http/http.service';

type Constructor = {
  http: Http;
  apiPrefix: string;
};

class AuthApi {
  #http: Http;

  #apiPrefix: string;

  public constructor({ http, apiPrefix }: Constructor) {
    this.#http = http;
    this.#apiPrefix = apiPrefix;
  }

  public register(payload: SignUpType): Promise<string> {
    return this.#http.load(`${this.#apiPrefix}/auth/register`, {
      method: HttpMethod.POST,
      hasAuth: false,
      contentType: ContentType.JSON,
      payload: JSON.stringify(payload),
    });
  }

  public login(payload: SignInType): Promise<ResponseType> {
    return this.#http.load(`${this.#apiPrefix}/auth/login`, {
      method: HttpMethod.POST,
      hasAuth: false,
      contentType: ContentType.JSON,
      payload: JSON.stringify(payload),
    });
  }
}

export { AuthApi };
