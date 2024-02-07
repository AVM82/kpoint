import './i18n/i18n';

import { Box } from '@mui/material';
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { store } from 'store/store';

import { ProjectsPage } from './components/all-projects-page/projects-page';
import { SignInPage } from './components/auth-page/sign-in-page';
import { SignUpPage } from './components/auth-page/sign-up-page';
import { Toast } from './components/common/common';
import { Footer } from './components/footer/footer';
import { Header } from './components/header/header';
import { ProjectDetailsPage } from './components/project-page/project-details-page';
import { ProjectCreate } from './components/projects/project-create/project-create';
import { SuggestionsPage } from './components/suggestions-page/suggestions-page';

const root = createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <StrictMode>
    <Provider store={store}>
      <Header/>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '80vh',
        }}
      >
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<ProjectsPage/>}/>
            <Route path="/projects/:projectId" element={<ProjectDetailsPage/>}/>
            <Route path="/projects/new" element={<ProjectCreate/>}/>
            <Route path="/sign-in" element={<SignInPage/>}/>
            <Route path="/sign-up" element={<SignUpPage/>}/>
            <Route path="/suggestions" element={<SuggestionsPage/>}/>
            {/*<Route path="/add-suggestions" element={<AddSuggestionModal/>}/>*/}
          </Routes>
        </BrowserRouter>
      </Box>
      <Footer/>
      <Toast/>
    </Provider>
  </StrictMode>,
);
