import { createReducer } from 'reduxsauce';
import Immutable from 'seamless-immutable';
import { createRoutine } from 'redux-saga-routines';

const PREFIX = 'TAG_CATEGORY/';

export const TagCategoryRoutines = {
  fetchTagCategories: createRoutine(`${PREFIX}FETCH_TAG_CATEGORIES`),
  createTagCategory: createRoutine(`${PREFIX}CREATE_TAG_CATEGORY`),
  fetchTagCategory: createRoutine(`${PREFIX}FETCH_TAG_CATEGORY`),
  removeTagCategory: createRoutine(`${PREFIX}REMOVE_TAG_CATEGORY`),
  updateTagCategory: createRoutine(`${PREFIX}UPDATE_TAG_CATEGORY`),
};

export const INITIAL_STATE = new Immutable({
  tagCategories: [],
  tagCategory: {},
});

const setTagCategories = (state = INITIAL_STATE, { payload }) => state.set('tagCategories', payload);
const setTagCategory = (state = INITIAL_STATE, { payload }) => state.set('tagCategory', payload);

export const reducer = createReducer(INITIAL_STATE, {
  [TagCategoryRoutines.fetchTagCategories.success]: setTagCategories,
  [TagCategoryRoutines.fetchTagCategory.success]: setTagCategory,
});
