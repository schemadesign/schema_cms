import { createSelector } from 'reselect';
import { prop } from 'ramda';

export const selectDataSourceTagDomain = prop('dataSourceTag');

export const selectTags = createSelector(selectDataSourceTagDomain, prop('tags'));

export const selectTag = createSelector(selectDataSourceTagDomain, prop('tag'));
