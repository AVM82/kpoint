import { authReducer as token } from './auth/reducer';
import { projectReducer as project } from './projects/reducer';

const rootReducer = { project, token };

export { rootReducer };

