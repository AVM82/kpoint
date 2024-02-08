import { ENV } from '../common/enums/enums';
import { AuthApi } from './auth/auth-api';
import { Http } from './http/http.service';
import { Notification } from './notification/notification.service';
import { ProjectApi } from './projects/project-api';
import { Storage } from './storage/storage.service';
import { SuggestionApi } from './suggestions/suggestion-api';

const storage = new Storage({ storage: sessionStorage });

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const http = new Http({ storage });

const authApi = new AuthApi({ http, apiPrefix: ENV.API_PATH });

const projectApi = new ProjectApi({ http, apiPrefix: ENV.API_PATH });

const notification = new Notification();

const suggestionApi = new SuggestionApi({ http, apiPrefix: ENV.API_PATH });

export { authApi, notification, projectApi, storage, suggestionApi };
