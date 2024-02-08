import { HttpMethod } from '../../common/enums/http/http-method.enum';
import { SuggestionType } from '../../common/types/suggestions/suggestion.type';
import { Http } from '../http/http.service';

type Constructor = {
  http: Http;
  apiPrefix: string;
};

class SuggestionApi {
  #http: Http;

  #apiPrefix: string;

  public constructor({ http, apiPrefix }: Constructor) {
    this.#http = http;
    this.#apiPrefix = apiPrefix;
  }

  public getAllSuggestions(payload:{ size: number, number: number }): Promise<SuggestionType> {
    return this.#http.load(
      `${this.#apiPrefix}/suggestions?size=${payload.size}&number=${payload.number}`, {
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

export { SuggestionApi };
