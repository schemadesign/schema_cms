import { connect } from 'react-redux';
import { bindPromiseCreators, promisifyRoutine } from 'redux-saga-routines';
import { createStructuredSelector } from 'reselect';
import { injectIntl } from 'react-intl';
import { withRouter } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import { compose, difference, pick } from 'ramda';
import { withFormik } from 'formik';

import { ProjectTag } from './projectTag.component';
import { TagCategoryRoutines, selectTagCategory } from '../../modules/tagCategory';
import { errorMessageParser } from '../../shared/utils/helpers';
import messages from './projectTag.messages';
import {
  INITIAL_VALUES,
  TAG_FORM,
  TAG_NAME,
  TAG_REMOVE_TAGS,
  TAG_TAGS,
  TAGS_SCHEMA,
} from '../../modules/tagCategory/tagCategory.constants';
import reportError from '../../shared/utils/reportError';
import { selectUserRole } from '../../modules/userProfile';
import { selectProject } from '../../modules/project';

const mapStateToProps = createStructuredSelector({
  tag: selectTagCategory,
  userRole: selectUserRole,
  project: selectProject,
});

export const mapDispatchToProps = dispatch =>
  bindPromiseCreators(
    {
      fetchTag: promisifyRoutine(TagCategoryRoutines.fetchTagCategory),
      updateTag: promisifyRoutine(TagCategoryRoutines.updateTagCategory),
      removeTag: promisifyRoutine(TagCategoryRoutines.removeTagCategory),
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
    displayName: TAG_FORM,
    enableReinitialize: true,
    mapPropsToValues: ({ tag }) => ({ ...INITIAL_VALUES, ...pick([TAG_NAME, TAG_TAGS], tag) }),
    validationSchema: () => TAGS_SCHEMA,
    handleSubmit: async (data, { props, setSubmitting, setErrors }) => {
      try {
        setSubmitting(true);
        const { tag, updateTag } = props;
        const projectId = tag.project.id;
        const tags = tag[TAG_TAGS];
        const dataWithOrder = data[TAG_TAGS].map((item, index) => ({ ...item, execOrder: index }));
        const tagWithOrder = tags.map((item, index) => ({ ...item, execOrder: index }));
        const formData = {
          tags: difference(dataWithOrder, tagWithOrder),
          name: data[TAG_NAME],
          deleteTags: data[TAG_REMOVE_TAGS],
        };

        await updateTag({ projectId, tagId: tag.id, formData });
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
)(ProjectTag);
