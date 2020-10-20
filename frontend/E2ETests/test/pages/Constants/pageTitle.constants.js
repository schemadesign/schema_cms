export default {
  djangoHomepage: 'Site administration | Django site admin',
  djangoSelectUserToChange: 'Select user to change | Django site admin',
  login: 'Sign In with Auth0',
  homepage: 'Projects Overview - Schema CMS',
  users: 'Schema CMS',
  resetPassword: 'Change your password',
  projectDetails: 'Project - Schema CMS',
  datasource: 'Data Sources - Schema CMS',
  createDataSource: 'Create Data Source - Schema CMS',
  source: 'Source - Schema CMS',
  datasourcePreview: 'Fields - Schema CMS',
  steps: 'Data Wrangling - Schema CMS',
  datasourceResults: 'Data Wrangling Result - Schema CMS',
  filters: 'Filters - Schema CMS',
  tags: 'TagTemplates - Schema CMS',
  states: 'States - Schema CMS',
  metadata: 'Metadata - Schema CMS',
  templates: 'Templates - Schema CMS',
  tagTemplates: 'Tag Categories - Schema CMS',
  createTagTemplate: 'Schema CMS',
  blockTemplates: 'Block Templates - Schema CMS',
  createBlockTemplate: 'Block Template - Schema CMS',
  get settings() {
    return this.projectDetails;
  },
  get sources() {
    return this.datasource;
  },
};
