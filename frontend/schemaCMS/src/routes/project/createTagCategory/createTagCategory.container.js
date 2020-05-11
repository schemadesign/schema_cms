import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';
import { injectIntl } from 'react-intl';
import { hot } from 'react-hot-loader';
import { bindPromiseCreators, promisifyRoutine } from 'redux-saga-routines';
import { compose } from 'ramda';
import { withFormik } from 'formik';

import { CreateTagCategory } from './createTagCategory.component';
import { TagCategoryRoutines } from '../../../modules/tagCategory';
import { selectUserRole } from '../../../modules/userProfile';
import {
  INITIAL_VALUES,
  TAG_CATEGORY_FORM,
  TAG_CATEGORY_TAGS,
  TAG_CATEGORY_SCHEMA,
} from '../../../modules/tagCategory/tagCategory.constants';
import reportError from '../../../shared/utils/reportError';
import { errorMessageParser, getMatchParam, mapAndAddOrder } from '../../../shared/utils/helpers';
import messages from './createTagCategory.messages';
import { selectProject } from '../../../modules/project';

const mapStateToProps = createStructuredSelector({
  userRole: selectUserRole,
  project: selectProject,
});

export const mapDispatchToProps = dispatch =>
  bindPromiseCreators(
    {
      createTagCategory: promisifyRoutine(TagCategoryRoutines.createTagCategory),
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
    mapPropsToValues: () => INITIAL_VALUES,
    validationSchema: () => TAG_CATEGORY_SCHEMA,
    handleSubmit: async (data, { props, setSubmitting, setErrors }) => {
      try {
        setSubmitting(true);
        const { createTagCategory } = props;
        const projectId = getMatchParam(props, 'projectId');
        const tags = mapAndAddOrder(data[TAG_CATEGORY_TAGS]);
        const formData = {
          ...data,
          tags,
        };

        await createTagCategory({ projectId, formData });
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
)(CreateTagCategory);
