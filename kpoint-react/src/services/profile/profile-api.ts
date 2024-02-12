import { HttpMethod } from 'common/enums/http/http-method.enum';
import { ProjectsPageType } from 'common/types/types';

import { Http } from '../http/http.service';

type Constructor = {
  http: Http;
  apiPrefix: string;
};

class ProfileApi {
  #http: Http;

  #apiPrefix: string;

  public constructor({ http, apiPrefix }: Constructor) {
    this.#http = http;
    this.#apiPrefix = apiPrefix;
  }

  public getMyProjects(payload: {
    size: number;
    number: number;
  }): Promise<ProjectsPageType> {
    return this.#http.load(
      `${this.#apiPrefix}/projects?size=${payload.size}&number=${
        payload.number
      }`,
      {
        method: HttpMethod.GET,
        hasAuth: false,
        queryString: {
          size: payload.size,
          page: payload.number,
        },
      },
    );
  }
}

export { ProfileApi };