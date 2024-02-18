import { HttpMethod } from 'common/enums/http/http-method.enum';
import { TestRequest } from 'common/types/projects/testRequest';
import {
  ProjectsPageType,
  ProjectType,
} from 'common/types/types';

// import qs from 'query-string';
import { ContentType } from '../../common/enums/file/content-type.enum';
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

  public createNew(payload: TestRequest): Promise<ProjectType> {
    const a = new FormData();
    a.append('file', payload.file);
    const b  = JSON.stringify(payload.createdProject);
    a.append('createdProject', b);
    a.set('createdProject.type', 'application/json');
    console.log(a.get('createdProject'));
    console.log(a.get('file'));

    return this.#http.load(`${this.#apiPrefix}/projects`, {
      method: HttpMethod.POST,
      payload: a,
      contentType: ContentType.FORM_DATA,
    });
  }

  public subscribeToProject(payload: { id: string }): Promise<string> {
    return this.#http.load(`${this.#apiPrefix}/projects/${payload.id}/subscribe`, {
      method: HttpMethod.POST,
      payload: JSON.stringify(payload),
      contentType: ContentType.JSON,
    });
  }
}

export { ProjectApi };
