export default {
  djangoUsers: `${process.env[`DJANGO_${process.env.ENV}`]}users/user/`,
  homepage: new RegExp(`${browser.config.baseUrl}/project`),
  login: new RegExp(/https:\/\/schemadesign(-[a-z]*)?\.auth0\.com\/login\?state=([a-zA-Z0-9#]*)/),
  users: new RegExp(`${browser.config.baseUrl}/user`),
  addUser: new RegExp(`${browser.config.baseUrl}/user/add`),
  resetPassword: new RegExp(/https:\/\/schemadesign(-[a-z]*)?\.auth0\.com\/lo\/reset\?ticket=([a-zA-Z0-9#]*)/),
  projectDetails: new RegExp(`${browser.config.baseUrl}/project/([1-9]*)`),
  datasource: new RegExp(`${browser.config.baseUrl}/project/([0-9]*)/datasource`),
  source: new RegExp(`${browser.config.baseUrl}/datasource/([0-9]*)/source`),
  datasourcePreview: new RegExp(`${browser.config.baseUrl}/datasource/([0-9]*)/preview`),
  datasourceResults: new RegExp(`${browser.config.baseUrl}/datasource/([0-9]*)/result`),
  steps: new RegExp(`${browser.config.baseUrl}/datasource/([0-9]*)/steps`),
  filters: new RegExp(`${browser.config.baseUrl}/datasource/([0-9]*)/filters`),
  tags: new RegExp(`${browser.config.baseUrl}/datasource/([0-9]*)/tag`),
  states: new RegExp(`${browser.config.baseUrl}/datasource/([0-9]*)/states`),
  metadata: new RegExp(`${browser.config.baseUrl}/datasource/([0-9]*)/metadata`),
  templates: new RegExp(`${browser.config.baseUrl}/project/([0-9]*)/templates`),
  tagTemplates: new RegExp(`${browser.config.baseUrl}/project/([0-9]*)/tag-templates`),
  createTagTemplate: new RegExp(`${browser.config.baseUrl}/project/([0-9]*)/tag-templates/create`),
  get settings() {
    return this.projectDetails;
  },
  get sources() {
    return this.datasource;
  },
};
