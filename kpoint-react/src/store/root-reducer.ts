import { authReducer as token } from './auth/reducer';
import { projectReducer as project } from './projects/reducer';
import { suggestionReducer as suggestion } from './suggestions/reducer';

const rootReducer = { project, token, suggestion  };

export { rootReducer };

