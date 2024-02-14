import { authReducer as token } from './auth/reducer';
import { profileReducer as profile } from './profile/reducer';
import { projectReducer as project } from './projects/reducer';
import { suggestionReducer as suggestion } from './suggestions/reducer';

const rootReducer = { project, token, suggestion, profile };

export { rootReducer };
