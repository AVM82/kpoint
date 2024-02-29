import { ENV } from '../common/enums/enums';
import { AuthApi } from './auth/auth-api';
import { Http } from './http/http.service';
import { Notification } from './notification/notification.service';
import { ProfileApi } from './profile/profile-api';
import { ProjectApi } from './projects/project-api';
import { Storage } from './storage/storage.service';
import { SuggestionApi } from './suggestions/suggestion-api';

const storage = new Storage({ storage: localStorage });

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const http = new Http({ storage });

const authApi = new AuthApi({ http, apiPrefix: ENV.API_PATH });

const profileApi = new ProfileApi({ http, apiPrefix: ENV.API_PATH });
const projectApi = new ProjectApi({ http, apiPrefix: ENV.API_PATH });

const notification = new Notification();

const suggestionApi = new SuggestionApi({ http, apiPrefix: ENV.API_PATH });

export {
  authApi,
  notification,
  profileApi,
  projectApi,
  storage,
  suggestionApi,
};
