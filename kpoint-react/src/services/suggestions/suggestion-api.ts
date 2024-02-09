import { ContentType } from '../../common/enums/file/content-type.enum';
import { HttpMethod } from '../../common/enums/http/http-method.enum';
import { SuggestionType } from '../../common/types/suggestions/suggestion.type';
import { SuggestionCreateType } from '../../common/types/suggestions/suggestion-create.type';
import { SuggestionsPageType } from '../../common/types/suggestions/suggestions-page.type';
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

  public getAllSuggestions(payload:{ size: number, number: number }): Promise<SuggestionsPageType> {
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

  public createNew(payload: SuggestionCreateType): Promise<SuggestionType> {
    return this.#http.load(
      `${this.#apiPrefix}/suggestions`, {
        method: HttpMethod.POST,
        payload: JSON.stringify(payload),
        contentType: ContentType.JSON,
      },
    );
  }

}

export { SuggestionApi };
