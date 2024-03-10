import './i18n/i18n';
import 'index.css';

import { CssBaseline } from '@mui/material';
import { ProjectsPage } from 'components/all-projects-page/projects-page';
import { SignInPage } from 'components/auth-page/sign-in-page';
import { SignUpPage } from 'components/auth-page/sign-up-page';
import { Footer } from 'components/footer/footer';
import { Header } from 'components/header/header';
import { MyProfile } from 'components/profile-page/my-profile/my-profile';
import { ProfilePassword } from 'components/profile-page/profile-password/profile-password';
import { ProfilePage } from 'components/profile-page/projects-in-profile/profile-page';
import { ProjectPage } from 'components/project-page/project-page';
import { ProjectCreate } from 'components/projects/project-create/project-create';
import { SuggestionsPage } from 'components/suggestions-page/suggestions-page';
import { FC } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Route,Routes } from 'react-router-dom';
import { store } from 'store/store';

import { Toast } from './components/common/common';

const App: FC = () => {
  return <Provider store={store}>
    <CssBaseline>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<ProjectsPage />} />
          <Route path="/:username" element={<ProfilePage />} />
          <Route path="/projects/:projectId" element={<ProjectPage />} />
          <Route path="/projects/new" element={<ProjectCreate />} />
          <Route path="/sign-in" element={<SignInPage />} />
          <Route path="/sign-up" element={<SignUpPage />} />
          <Route path="/suggestions" element={<SuggestionsPage />} />
          <Route path="/settings/profile" element={<MyProfile />}></Route>
          <Route
            path="/password/profile"
            element={<ProfilePassword />}
          ></Route>
        </Routes>
        <Footer />
      </BrowserRouter>
      <Toast />
    </CssBaseline>
  </Provider>;
};

export { App };