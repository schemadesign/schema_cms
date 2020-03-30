import { createSelector } from 'reselect';
import { prop } from 'ramda';

export const selectPageTemplatesDomain = prop('pageTemplates');

export const selectPageTemplates = createSelector(selectPageTemplatesDomain, prop('pageTemplates'));

export const selectPageTemplate = createSelector(selectPageTemplatesDomain, prop('pageTemplate'));
