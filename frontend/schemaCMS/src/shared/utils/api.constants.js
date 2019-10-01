const API_PREFIX = process.env.REACT_APP_BASE_API_URL;

export const AUTH_PATH = `${API_PREFIX}/auth/login/auth0`;
export const TOKEN_PATH = '/auth/token';
export const LOGOUT_URL = `${API_PREFIX}/auth/logout`;
export const ME_PATH = '/users/me';
export const PROJECTS_PATH = '/projects';
export const DATA_SOURCE_PATH = '/datasource';
export const DATA_SOURCES_PATH = '/datasources';
export const DATA_WRANGLING_SCRIPTS_PATH = '/script';
export const DATA_WRANGLING_JOB_PATH = '/job';
export const PREVIEW_PATH = '/preview';
export const RESET_PASSWORD_PATH = `${ME_PATH}/reset-password`;
