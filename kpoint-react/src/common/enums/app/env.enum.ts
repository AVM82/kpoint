const { REACT_APP_API_PATH } = process.env;
const { REACT_APP_OAUTH2_GOOGLE_CLIENT_ID } = process.env;

const ENV = {
  API_PATH: REACT_APP_API_PATH ?? '',
  OAUTH2_GOOGLE_CLIENT_ID: REACT_APP_OAUTH2_GOOGLE_CLIENT_ID ?? '',
} as const;

export { ENV };
