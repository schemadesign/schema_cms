import { createSelector } from 'reselect';
import { prop } from 'ramda';

export const selectSectionsDomain = prop('sections');

export const selectSections = createSelector(
  selectSectionsDomain,
  prop('sections')
);

export const selectSection = createSelector(
  selectSectionsDomain,
  prop('section')
);
