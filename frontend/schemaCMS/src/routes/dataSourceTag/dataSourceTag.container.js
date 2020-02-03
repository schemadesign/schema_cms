import { connect } from 'react-redux';
import { bindPromiseCreators, promisifyRoutine } from 'redux-saga-routines';
import { createStructuredSelector } from 'reselect';
import { injectIntl } from 'react-intl';
import { withRouter } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import { compose, difference, pick } from 'ramda';
import { withFormik } from 'formik';

import { DataSourceTag } from './dataSourceTag.component';
import { DataSourceTagRoutines, selectTag } from '../../modules/dataSourceTag';
import { errorMessageParser } from '../../shared/utils/helpers';
import messages from '../folder/createPage/createPage.messages';
import {
  INITIAL_VALUES,
  TAG_FORM,
  TAG_NAME,
  TAG_REMOVE_TAGS,
  TAG_TAGS,
  TAGS_SCHEMA,
} from '../../modules/dataSourceTag/dataSourceTag.constants';
import reportError from '../../shared/utils/reportError';
import { selectUserRole } from '../../modules/userProfile';

const mapStateToProps = createStructuredSelector({
  tag: selectTag,
  userRole: selectUserRole,
});

export const mapDispatchToProps = dispatch =>
  bindPromiseCreators(
    {
      fetchTag: promisifyRoutine(DataSourceTagRoutines.fetchTag),
      updateTag: promisifyRoutine(DataSourceTagRoutines.updateTag),
      removeTag: promisifyRoutine(DataSourceTagRoutines.removeTag),
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
        const dataSourceId = tag.datasource.id;
        const tags = tag[TAG_TAGS];
        const dataWithOrder = data[TAG_TAGS].map((item, index) => ({ ...item, execOrder: index }));
        const tagWithOrder = tags.map((item, index) => ({ ...item, execOrder: index }));
        const formData = {
          tags: difference(dataWithOrder, tagWithOrder),
          name: data[TAG_NAME],
          deleteTags: data[TAG_REMOVE_TAGS],
        };

        await updateTag({ dataSourceId, tagId: tag.id, formData });
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
)(DataSourceTag);
