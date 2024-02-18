import { HttpMethod } from 'common/enums/http/http-method.enum';
import {
  ProjectsEditType,
  ProjectsPageType,
  ProjectType,
} from 'common/types/types';

import { ContentType } from '../../common/enums/file/content-type.enum';
import { SubscriptionRequestType } from '../../common/types/projects/subscription-request.type';
import { Http } from '../http/http.service';

type Constructor = {
  http: Http;
  apiPrefix: string;
};

class ProjectApi {
  #http: Http;

  #apiPrefix: string;

  public constructor({ http, apiPrefix }: Constructor) {
    this.#http = http;
    this.#apiPrefix = apiPrefix;
  }

  public getById(payload: { id: string }): Promise<ProjectType> {
    return this.#http.load(`${this.#apiPrefix}/projects/${payload.id}`, {
      method: HttpMethod.GET,
      hasAuth: false,
    });
  }

  public getAllProjectsDefault(payload: {
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

  public getAllProjectsAddMore(payload: {
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

  public createNew(payload: ProjectsEditType): Promise<ProjectType> {
    return this.#http.load(`${this.#apiPrefix}/projects`, {
      method: HttpMethod.POST,
      payload: JSON.stringify(payload),
      contentType: ContentType.JSON,
    });
  }

  public subscribeToProject(payload: { id: string }): Promise<SubscriptionRequestType> {
    return this.#http.load(`${this.#apiPrefix}/projects/${payload.id}/subscribe`, {
      method: HttpMethod.POST,
      payload: JSON.stringify(payload),
      contentType: ContentType.JSON,
    });
  }
}

export { ProjectApi };
