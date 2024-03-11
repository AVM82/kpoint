import { AcceptLanguage, ContentType, HttpMethod } from 'common/enums/enums';

type HttpOptions = {
  method: HttpMethod;
  contentType: ContentType;
  payload: BodyInit | null;
  hasAuth?: boolean;
  acceptLanguage?: AcceptLanguage,
  queryString?: Record<string, unknown>;
  headers?: Record<string, string>;
};

export { type HttpOptions };
