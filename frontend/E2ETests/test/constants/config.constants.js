export const TIMEOUT = 30000;
export const ASSERT_EMPTY_VALIDATION_MESSAGE = 'Validation message is not displayed';
const LOCAL = false;
const LOCAL_PATH = 'http://localhost:3000';
const STAGE_PATH = 'https://schema-test.appt5n.com';
export const BASE_URL = LOCAL ? LOCAL_PATH : STAGE_PATH;
export const AUTH0_STAGE_HOST = 'schemadesign-stage.auth0.com';
export const AUTH0_STAGE_ORIGIN = `https://${AUTH0_STAGE_HOST}`;
export const TAB_PAGE_TITLE = {
  settings: 'Project - Schema CMS',
  sources: 'Data Sources - Schema CMS',
  states: 'States - Schema CMS',
  pages: 'Folders - Schema CMS',
  users: 'Schema CMS',
};
