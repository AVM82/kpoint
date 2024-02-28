import { HttpMethod } from 'common/enums/http/http-method.enum';
import { ApiResponseType, JsonPatchType, ProfileType, ProjectsPageType } from 'common/types/types';

import { ContentType } from '../../common/enums/file/content-type.enum';
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
      `${this.#apiPrefix}/profile/myProjects?size=${payload.size}&number=${
        payload.number
      }`,
      {
        method: HttpMethod.GET,
        queryString: {
          size: payload.size,
          page: payload.number,
        },
      },
    );
  }

  public getRecommendProjects(payload: {
    size: number,
    number: number,
  }): Promise<ProjectsPageType> {
    return this.#http.load(
      `${this.#apiPrefix}/projects?size=${payload.size}&number=${
        payload.number
      }`,
      {
        method: HttpMethod.GET,
        queryString: {
          size: payload.size,
          page: payload.number,
        },
      },
    );
  }

  public  getFavoriteProjects(payload: {
    size: number,
    number: number,
  }): Promise<ProjectsPageType> {
    return this.#http.load(
      `${this.#apiPrefix}/profile/subscribedProjects?size=${payload.size}&number=${
        payload.number
      }`,
      {
        method: HttpMethod.GET,
        queryString: {
          size: payload.size,
          page: payload.number,
        },
      },
    );
  }

  public updateProfile( payload : JsonPatchType ): Promise<ProfileType> {
    return this.#http.load(
      `${this.#apiPrefix}/profile/settings`,
      {
        method: HttpMethod.PATCH,
        payload: JSON.stringify(payload.body),
        contentType: ContentType.JSON,
      },
    );
  }

  public changePassword(payload: {
    oldPassword: string;
    newPassword: string;
  }): Promise<ApiResponseType> {
    return this.#http.load(
      `${this.#apiPrefix}/profile/changePassword`,
      {
        method: HttpMethod.PATCH,
        payload: JSON.stringify(payload),
        contentType: ContentType.JSON,
      },
    );
  }

  public existsEmail(payload: {
    email: string;
  }): Promise<ApiResponseType> {
    return this.#http.load(
      `${this.#apiPrefix}/users/${payload.email}/exists_email`,
      {
        method: HttpMethod.GET,
      },
    );
  }

  public existsUsername(payload: {
    username: string;
  }): Promise<ApiResponseType> {
    return this.#http.load(
      `${this.#apiPrefix}/users/${payload.username}/exists_username`,
      {
        method: HttpMethod.GET,
      },
    );
  }

  public updateAvatar(payload: {
    logo: File;
  }): Promise<ApiResponseType> {
    const bodyData = new FormData();
    bodyData.append('file', payload.logo);

    return this.#http.load(
      `${this.#apiPrefix}/profile/avatar`,
      {
        method: HttpMethod.PATCH,
        payload: bodyData,
      },
    );
  }
}

export { ProfileApi };
