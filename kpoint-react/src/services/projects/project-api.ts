import { HttpMethod } from 'common/enums/http/http-method.enum';
import { TestRequest } from 'common/types/projects/testRequest';
import {
  ProjectsPageType,
  ProjectType,
} from 'common/types/types';

// import qs from 'query-string';
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
      // hasAuth: false,
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

  public createNew(payload: TestRequest): Promise<ProjectType> {
    const formData = new FormData();
    formData.append('createdProject', new Blob([JSON.stringify(payload.createdProject)],
      { type: 'application/json' }));
    formData.append('file', payload.file);

    return this.#http.load(`${this.#apiPrefix}/projects`, {
      method: HttpMethod.POST,
      payload: formData,
    });
  }

  public subscribeToProject(payload: { projectId: string }): Promise<SubscriptionRequestType> {
    return this.#http.load(`${this.#apiPrefix}/projects/${payload.projectId}/subscribe`, {
      method: HttpMethod.POST,
      payload: JSON.stringify(payload),
      contentType: ContentType.JSON,
    });
  }
}

export { ProjectApi };
