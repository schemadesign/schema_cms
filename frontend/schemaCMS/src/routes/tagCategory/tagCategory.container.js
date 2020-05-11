import { connect } from 'react-redux';
import { bindPromiseCreators, promisifyRoutine } from 'redux-saga-routines';
import { createStructuredSelector } from 'reselect';
import { injectIntl } from 'react-intl';
import { withRouter } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import { compose, difference, pick } from 'ramda';
import { withFormik } from 'formik';

import { TagCategory } from './tagCategory.component';
import { TagCategoryRoutines, selectTagCategory } from '../../modules/tagCategory';
import { errorMessageParser, mapAndAddOrder } from '../../shared/utils/helpers';
import messages from './tagCategory.messages';
import {
  INITIAL_VALUES,
  TAG_CATEGORY_FORM,
  TAG_CATEGORY_NAME,
  TAG_CATEGORY_REMOVE_TAGS,
  TAG_CATEGORY_TAGS,
  TAG_CATEGORY_SCHEMA,
} from '../../modules/tagCategory/tagCategory.constants';
import reportError from '../../shared/utils/reportError';
import { selectUserRole } from '../../modules/userProfile';
import { selectProject } from '../../modules/project';

const mapStateToProps = createStructuredSelector({
  tagCategory: selectTagCategory,
  userRole: selectUserRole,
  project: selectProject,
});

export const mapDispatchToProps = dispatch =>
  bindPromiseCreators(
    {
      fetchTagCategory: promisifyRoutine(TagCategoryRoutines.fetchTagCategory),
      updateTagCategory: promisifyRoutine(TagCategoryRoutines.updateTagCategory),
      removeTagCategory: promisifyRoutine(TagCategoryRoutines.removeTagCategory),
    },
    dispatch
  );

export default compose(
  hot(module),
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  injectIntl,
  withRouter,
  withFormik({
    displayName: TAG_CATEGORY_FORM,
    enableReinitialize: true,
    mapPropsToValues: ({ tagCategory }) => ({
      ...INITIAL_VALUES,
      ...pick([TAG_CATEGORY_NAME, TAG_CATEGORY_TAGS], tagCategory),
    }),
    validationSchema: () => TAG_CATEGORY_SCHEMA,
    handleSubmit: async (data, { props, setSubmitting, setErrors }) => {
      try {
        setSubmitting(true);
        const { tagCategory, updateTagCategory, project } = props;
        const tags = tagCategory[TAG_CATEGORY_TAGS];
        const dataWithOrder = mapAndAddOrder(data[TAG_CATEGORY_TAGS]);
        const tagWithOrder = mapAndAddOrder(tags);
        const formData = {
          tags: difference(dataWithOrder, tagWithOrder),
          name: data[TAG_CATEGORY_NAME],
          deleteTags: data[TAG_CATEGORY_REMOVE_TAGS],
        };

        await updateTagCategory({ projectId: project.id, tagCategoryId: tagCategory.id, formData });
      } catch (errors) {
        reportError(errors);
        const { formatMessage } = props.intl;
        const errorMessages = errorMessageParser({ errors, messages, formatMessage });

        setErrors(errorMessages);
      } finally {
        setSubmitting(false);
      }
    },
  })
)(TagCategory);
